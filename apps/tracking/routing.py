"""tracking/routing.py - WebSocket URL routing"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Student/admin tracks all active buses
    re_path(r'ws/tracking/all/$',                   consumers.BusTrackingConsumer.as_asgi()),
    # Track buses on a specific route
    re_path(r'ws/tracking/route/(?P<route_id>\d+)/$', consumers.BusTrackingConsumer.as_asgi()),
    # Driver streams GPS
    re_path(r'ws/driver/gps/$',                     consumers.DriverGPSConsumer.as_asgi()),
    # Admin dashboard
    re_path(r'ws/admin/$',                          consumers.AdminConsumer.as_asgi()),
]
