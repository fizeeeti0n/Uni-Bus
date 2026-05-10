"""buses/serializers.py"""

from rest_framework import serializers
from .models import Bus, BusMaintenanceLog


class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BusMaintenanceLog
        fields = '__all__'
        read_only_fields = ['created_at']


class BusSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    maintenance_logs = MaintenanceLogSerializer(many=True, read_only=True)

    class Meta:
        model  = Bus
        fields = [
            'id', 'bus_number', 'registration_no', 'model', 'capacity',
            'status', 'has_ac', 'manufacture_year', 'last_service_date',
            'photo', 'driver_name', 'maintenance_logs', 'created_at',
        ]

    def get_driver_name(self, obj):
        if hasattr(obj, 'assigned_driver') and obj.assigned_driver:
            return obj.assigned_driver.user.get_full_name()
        return None


class BusListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    driver_name = serializers.SerializerMethodField()

    class Meta:
        model  = Bus
        fields = ['id', 'bus_number', 'registration_no', 'capacity', 'status', 'has_ac', 'driver_name']

    def get_driver_name(self, obj):
        if hasattr(obj, 'assigned_driver') and obj.assigned_driver:
            return obj.assigned_driver.user.get_full_name()
        return None
