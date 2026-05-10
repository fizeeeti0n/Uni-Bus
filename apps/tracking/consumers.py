"""
tracking/consumers.py
WebSocket consumers for real-time bus tracking using Django Channels.
Uses Leaflet.js + OpenStreetMap on the frontend (no API key needed).
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone


class BusTrackingConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for students/admin tracking buses.

    Connect: ws://host/ws/tracking/route/<route_id>/
         or: ws://host/ws/tracking/all/

    Receives bus location broadcasts and forwards to connected clients.
    """

    async def connect(self):
        self.route_id = self.scope['url_route']['kwargs'].get('route_id', 'all')

        if self.route_id == 'all':
            self.group_name = 'all_buses'
        else:
            self.group_name = f'route_{self.route_id}'

        # Join the channel group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send current snapshot on connect
        buses = await self.get_active_buses(self.route_id)
        await self.send(text_data=json.dumps({
            'type':    'snapshot',
            'buses':   buses,
            'message': 'Connected to UniBus live tracking (OpenStreetMap powered)',
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle ping or route-change messages from client."""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if data.get('type') == 'ping':
            await self.send(text_data=json.dumps({'type': 'pong'}))

    # Called by group_send from BusViewSet._broadcast_bus_update
    async def bus_location_update(self, event):
        await self.send(text_data=json.dumps({
            'type':    'bus_update',
            'payload': event['payload'],
        }))

    @database_sync_to_async
    def get_active_buses(self, route_id):
        from apps.buses.models import Bus
        from apps.buses.serializers import BusLiveSerializer

        qs = Bus.objects.filter(status='active').select_related('route', 'current_stop')
        if route_id != 'all':
            qs = qs.filter(route_id=route_id)

        return BusLiveSerializer(qs, many=True).data


class DriverGPSConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for drivers.
    Driver connects, sends GPS updates every N seconds.
    Server broadcasts to tracking groups.

    Connect: ws://host/ws/driver/gps/
    Send:  { "type": "gps_update", "lat": 23.81, "lng": 90.41, "speed": 35, "heading": 180 }
    """

    async def connect(self):
        user = self.scope.get('user')
        if not user or not user.is_authenticated or user.role != 'driver':
            await self.close(code=4001)
            return

        self.user = user
        self.driver = await self.get_driver_profile(user)
        if not self.driver:
            await self.close(code=4002)
            return

        self.bus = await self.get_assigned_bus(self.driver)
        if not self.bus:
            await self.close(code=4003)
            return

        self.group_name = f'driver_{user.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            'type':    'connected',
            'bus':     self.bus.bus_number,
            'message': 'GPS streaming active',
        }))

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if data.get('type') == 'gps_update':
            await self.handle_gps_update(data)
        elif data.get('type') == 'sos':
            await self.handle_sos(data)

    async def handle_gps_update(self, data):
        lat     = data.get('lat')
        lng     = data.get('lng')
        speed   = data.get('speed', 0)
        heading = data.get('heading', 0)

        if lat is None or lng is None:
            return

        # Persist to DB
        updated_bus = await self.update_bus_location(lat, lng, speed, heading)

        # Build payload
        from apps.buses.serializers import BusLiveSerializer
        payload = await database_sync_to_async(lambda: BusLiveSerializer(updated_bus).data)()

        # Broadcast to route group and global group
        route_id = updated_bus.route_id
        for group in ([f'route_{route_id}'] if route_id else []) + ['all_buses']:
            await self.channel_layer.group_send(group, {
                'type':    'bus_location_update',
                'payload': payload,
            })

        # Acknowledge
        await self.send(text_data=json.dumps({'type': 'ack', 'ts': str(timezone.now())}))

    async def handle_sos(self, data):
        """Trigger SOS alert — notify admins."""
        await self.create_sos_alert(data)
        await self.channel_layer.group_send('admin_alerts', {
            'type':    'sos_alert',
            'bus':     self.bus.bus_number,
            'driver':  self.user.get_full_name(),
            'issue':   data.get('issue', 'Unknown'),
            'coords':  {'lat': data.get('lat'), 'lng': data.get('lng')},
        })
        await self.send(text_data=json.dumps({'type': 'sos_ack', 'message': 'SOS sent to admin.'}))

    @database_sync_to_async
    def get_driver_profile(self, user):
        try:
            return user.driver_profile
        except Exception:
            return None

    @database_sync_to_async
    def get_assigned_bus(self, driver):
        try:
            return driver.bus
        except Exception:
            return None

    @database_sync_to_async
    def update_bus_location(self, lat, lng, speed, heading):
        from apps.buses.models import Bus
        Bus.objects.filter(id=self.bus.id).update(
            current_lat=lat, current_lng=lng,
            current_speed=speed, heading=heading,
            last_gps_update=timezone.now(),
        )
        self.bus.refresh_from_db()
        return self.bus

    @database_sync_to_async
    def create_sos_alert(self, data):
        from apps.notifications.models import SOSAlert
        SOSAlert.objects.create(
            bus=self.bus,
            driver=self.driver,
            issue_type=data.get('issue', 'other'),
            latitude=data.get('lat'),
            longitude=data.get('lng'),
        )


class AdminConsumer(AsyncWebsocketConsumer):
    """Admin dashboard real-time updates."""

    async def connect(self):
        user = self.scope.get('user')
        if not user or not user.is_authenticated or user.role != 'admin':
            await self.close(code=4001)
            return

        await self.channel_layer.group_add('admin_alerts', self.channel_name)
        await self.channel_layer.group_add('all_buses',    self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('admin_alerts', self.channel_name)
        await self.channel_layer.group_discard('all_buses',    self.channel_name)

    async def bus_location_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bus_update', 'payload': event['payload']
        }))

    async def sos_alert(self, event):
        await self.send(text_data=json.dumps({
            'type':   'sos_alert',
            'bus':    event['bus'],
            'driver': event['driver'],
            'issue':  event['issue'],
            'coords': event['coords'],
        }))
