"""buses/views.py"""
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Bus, Trip, DelayReport
from .serializers import BusSerializer, BusLiveSerializer, TripSerializer, DelayReportSerializer
from apps.notifications.tasks import send_delay_notification


# --- Custom Permissions ---

class IsAdminOrDriver(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'driver')


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


# --- ViewSets ---

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.select_related('route', 'driver__user', 'current_stop')
    serializer_class = BusSerializer

    def get_permissions(self):
        """
        Custom permissions logic:
        - Students/Public: Can see live locations without logging in.
        - Admins: Full CRUD access.
        - Authenticated: Can view basic bus lists.
        """
        if self.action in ('live', 'live_by_route'):
            return [AllowAny()]
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdmin()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='live')
    def live(self, request):
        """All active buses with live GPS — used by the student map."""
        buses = Bus.objects.filter(status='active').select_related('route', 'current_stop')
        serializer = BusLiveSerializer(buses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='live/route/(?P<route_id>[^/.]+)')
    def live_by_route(self, request, route_id=None):
        """Active buses for a specific route."""
        buses = Bus.objects.filter(status='active', route_id=route_id).select_related('route', 'current_stop')
        return Response(BusLiveSerializer(buses, many=True).data)

    @action(detail=True, methods=['post'], url_path='start-trip', permission_classes=[IsAdminOrDriver])
    def start_trip(self, request, pk=None):
        bus = self.get_object()
        if bus.status == 'active':
            return Response({'error': 'Trip already active.'}, status=status.HTTP_400_BAD_REQUEST)

        bus.start_trip()
        driver = getattr(request.user, 'driver_profile', None)
        trip = Trip.objects.create(bus=bus, driver=driver, route=bus.route) if driver and bus.route else None

        self._broadcast_bus_update(bus)
        return Response({'message': 'Trip started.', 'trip_id': trip.id if trip else None})

    @action(detail=True, methods=['post'], url_path='end-trip', permission_classes=[IsAdminOrDriver])
    def end_trip(self, request, pk=None):
        bus = self.get_object()
        bus.end_trip()
        Trip.objects.filter(bus=bus, status='in_progress').update(
            status='completed', ended_at=timezone.now()
        )
        self._broadcast_bus_update(bus)
        return Response({'message': 'Trip ended.'})

    @action(detail=True, methods=['post'], url_path='update-location', permission_classes=[IsAdminOrDriver])
    def update_location(self, request, pk=None):
        """Driver posts GPS update — broadcasts to all WebSocket subscribers."""
        bus = self.get_object()
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')
        speed = request.data.get('speed', 0)
        heading = request.data.get('heading', 0)

        if lat is None or lng is None:
            return Response({'error': 'latitude and longitude required.'}, status=400)

        bus.current_lat = lat
        bus.current_lng = lng
        bus.current_speed = speed
        bus.heading = heading
        bus.last_gps_update = timezone.now()
        bus.save(update_fields=['current_lat', 'current_lng', 'current_speed',
                                'heading', 'last_gps_update'])

        self._broadcast_bus_update(bus)
        return Response({'message': 'Location updated.'})

    def _broadcast_bus_update(self, bus):
        channel_layer = get_channel_layer()
        data = BusLiveSerializer(bus).data
        for group in [f'route_{bus.route_id}', 'all_buses']:
            async_to_sync(channel_layer.group_send)(group, {
                'type': 'bus_location_update',
                'payload': data,
            })


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Trip.objects.select_related('bus', 'driver__user', 'route').all()
        elif user.role == 'driver':
            driver = getattr(user, 'driver_profile', None)
            if driver:
                return Trip.objects.filter(driver=driver)
        return Trip.objects.none()


class DelayReportViewSet(viewsets.ModelViewSet):
    serializer_class = DelayReportSerializer
    permission_classes = [IsAdminOrDriver]

    def get_queryset(self):
        return DelayReport.objects.select_related('bus', 'trip')

    def perform_create(self, serializer):
        report = serializer.save()
        # Trigger Celery task to notify students asynchronously
        send_delay_notification.delay(report.id)