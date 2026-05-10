"""buses/serializers.py"""
from rest_framework import serializers
from .models import Bus, Trip, DelayReport, BusMaintenanceLog
from apps.accounts.serializers import DriverProfileSerializer
from apps.routes.serializers import RouteSerializer, BusStopSerializer


class BusSerializer(serializers.ModelSerializer):
    coords           = serializers.ReadOnlyField()
    occupancy_percent = serializers.ReadOnlyField()
    occupancy_label  = serializers.ReadOnlyField()
    driver_name      = serializers.SerializerMethodField()
    route_name       = serializers.SerializerMethodField()
    current_stop_name = serializers.SerializerMethodField()

    class Meta:
        model  = Bus
        fields = ['id', 'bus_number', 'license_plate', 'capacity', 'model',
                  'year', 'status', 'route', 'route_name', 'driver', 'driver_name',
                  'current_stop', 'current_stop_name',
                  'current_lat', 'current_lng', 'coords',
                  'current_speed', 'heading', 'last_gps_update',
                  'current_passengers', 'occupancy_percent', 'occupancy_label',
                  'updated_at']

    def get_driver_name(self, obj):
        if obj.driver and obj.driver.user:
            return obj.driver.user.get_full_name()
        return None

    def get_route_name(self, obj):
        return obj.route.name if obj.route else None

    def get_current_stop_name(self, obj):
        return obj.current_stop.name if obj.current_stop else None


class BusLiveSerializer(serializers.ModelSerializer):
    """Lightweight serializer for real-time WebSocket broadcasts."""
    coords          = serializers.ReadOnlyField()
    occupancy_label = serializers.ReadOnlyField()

    class Meta:
        model  = Bus
        fields = ['id', 'bus_number', 'status', 'coords',
                  'current_speed', 'heading', 'last_gps_update',
                  'current_passengers', 'capacity', 'occupancy_label',
                  'route', 'current_stop']


class TripSerializer(serializers.ModelSerializer):
    duration_minutes = serializers.ReadOnlyField()
    bus_number       = serializers.CharField(source='bus.bus_number', read_only=True)
    route_name       = serializers.CharField(source='route.name', read_only=True)
    driver_name      = serializers.SerializerMethodField()

    class Meta:
        model  = Trip
        fields = ['id', 'bus', 'bus_number', 'driver', 'driver_name',
                  'route', 'route_name', 'status', 'started_at', 'ended_at',
                  'duration_minutes', 'total_passengers', 'delay_minutes', 'notes']

    def get_driver_name(self, obj):
        return obj.driver.user.get_full_name() if obj.driver and obj.driver.user else None


class DelayReportSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DelayReport
        fields = ['id', 'bus', 'trip', 'delay_minutes', 'reason',
                  'notes', 'reported_at', 'notified_students']
        read_only_fields = ['reported_at', 'notified_students']
