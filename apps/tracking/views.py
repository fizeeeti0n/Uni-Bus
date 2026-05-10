"""
tracking/views.py
ETA computation using OSRM (open-source routing engine, free).
Map tiles: OpenStreetMap via Leaflet.js (free, no API key).
Geocoding: Nominatim (OpenStreetMap geocoder, free).
"""
import httpx
from django.conf import settings
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from apps.buses.models import Bus
from apps.routes.models import BusStop


class MapConfigView(APIView):
    """
    Returns map configuration to the frontend.
    Everything uses OpenStreetMap — 100% free, no API key required.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'tile_url':        settings.MAP_TILE_URL,
            'tile_attribution': settings.MAP_TILE_ATTRIBUTION,
            'default_lat':     settings.MAP_DEFAULT_LAT,
            'default_lng':     settings.MAP_DEFAULT_LNG,
            'default_zoom':    settings.MAP_DEFAULT_ZOOM,
            'osrm_url':        settings.OSRM_API_URL,
            'nominatim_url':   settings.NOMINATIM_URL,
            # WebSocket endpoints
            'ws_all_buses':    '/ws/tracking/all/',
            'ws_route':        '/ws/tracking/route/{route_id}/',
            'ws_driver':       '/ws/driver/gps/',
            'ws_admin':        '/ws/admin/',
        })


class ETAView(APIView):
    """
    Compute ETA from bus current location to a stop using OSRM.
    OSRM is the Open Source Routing Machine — completely free.
    Public demo: https://router.project-osrm.org
    Self-host:   https://github.com/Project-OSRM/osrm-backend
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, bus_id, stop_id):
        try:
            bus  = Bus.objects.get(id=bus_id)
            stop = BusStop.objects.get(id=stop_id)
        except (Bus.DoesNotExist, BusStop.DoesNotExist):
            return Response({'error': 'Bus or stop not found.'}, status=404)

        if not bus.coords:
            return Response({'error': 'Bus location unavailable.'}, status=400)

        eta_data = self._get_osrm_eta(
            origin_lat=float(bus.current_lat),
            origin_lng=float(bus.current_lng),
            dest_lat=float(stop.latitude),
            dest_lng=float(stop.longitude),
        )
        return Response({
            'bus_id':         bus.id,
            'bus_number':     bus.bus_number,
            'stop_id':        stop.id,
            'stop_name':      stop.name,
            'eta_seconds':    eta_data.get('duration'),
            'eta_minutes':    round(eta_data.get('duration', 0) / 60),
            'distance_meters': eta_data.get('distance'),
            'source':         'OSRM (OpenStreetMap)',
        })

    def _get_osrm_eta(self, origin_lat, origin_lng, dest_lat, dest_lng):
        """
        Call OSRM Route API.
        Docs: http://project-osrm.org/docs/v5.5.1/api/
        """
        url = (
            f"{settings.OSRM_API_URL}/route/v1/driving/"
            f"{origin_lng},{origin_lat};"
            f"{dest_lng},{dest_lat}"
            f"?overview=false&steps=false"
        )
        try:
            resp = httpx.get(url, timeout=5.0, headers={'User-Agent': settings.NOMINATIM_USER_AGENT})
            resp.raise_for_status()
            data  = resp.json()
            route = data['routes'][0]
            return {'duration': route['duration'], 'distance': route['distance']}
        except Exception:
            # Fallback: straight-line estimate at 30 km/h
            import math
            R   = 6371000
            lat1, lon1 = math.radians(origin_lat), math.radians(origin_lng)
            lat2, lon2 = math.radians(dest_lat),   math.radians(dest_lng)
            dlat = lat2 - lat1; dlon = lon2 - lon1
            a    = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
            dist = R * 2 * math.asin(math.sqrt(a))
            return {'duration': dist / (30000/3600), 'distance': dist}


class RouteETAView(APIView):
    """ETA for all stops on a route given a bus position."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, bus_id):
        try:
            bus = Bus.objects.select_related('route').get(id=bus_id)
        except Bus.DoesNotExist:
            return Response({'error': 'Bus not found.'}, status=404)

        if not bus.route or not bus.coords:
            return Response({'error': 'Bus not on route or location unavailable.'}, status=400)

        stops = bus.route.route_stops.select_related('stop').order_by('order')
        results = []
        for rs in stops:
            stop = rs.stop
            # Simple offset-based ETA (can be replaced with OSRM per-stop calls)
            results.append({
                'order':      rs.order,
                'stop_id':    stop.id,
                'stop_name':  stop.name,
                'latitude':   float(stop.latitude),
                'longitude':  float(stop.longitude),
                'eta_minutes': rs.minutes_offset,  # pre-configured offset
            })

        return Response({'bus': bus.bus_number, 'route': bus.route.name, 'stops': results})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def geocode_search(request):
    """
    Proxy Nominatim geocoding (OpenStreetMap geocoder — free, no API key).
    Usage: GET /api/tracking/geocode/?q=Dhaka+University
    """
    query = request.query_params.get('q', '')
    if not query:
        return Response({'error': 'q parameter required.'}, status=400)

    url = f"{settings.NOMINATIM_URL}/search"
    params = {'q': query, 'format': 'json', 'limit': 5, 'countrycodes': 'bd'}
    try:
        resp = httpx.get(url, params=params, timeout=5.0,
                         headers={'User-Agent': settings.NOMINATIM_USER_AGENT})
        return Response(resp.json())
    except Exception as e:
        return Response({'error': str(e)}, status=503)
