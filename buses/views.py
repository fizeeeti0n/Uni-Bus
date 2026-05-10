"""buses/views.py"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Bus, BusMaintenanceLog
from .serializers import BusSerializer, BusListSerializer, MaintenanceLogSerializer
from apps.accounts.permissions import IsAdminUser


class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all().select_related('assigned_driver__user')
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'has_ac']
    search_fields = ['bus_number', 'registration_no', 'model']

    def get_serializer_class(self):
        if self.action == 'list':
            return BusListSerializer
        return BusSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Only return buses currently in service"""
        buses = self.get_queryset().filter(status='active')
        serializer = BusListSerializer(buses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def add_maintenance_log(self, request, pk=None):
        bus = self.get_object()
        serializer = MaintenanceLogSerializer(data={**request.data, 'bus': bus.id})
        serializer.is_valid(raise_exception=True)
        serializer.save(bus=bus)
        # Update last service date on bus
        bus.last_service_date = serializer.validated_data.get('date')
        bus.save(update_fields=['last_service_date'])
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = BusMaintenanceLog.objects.all().select_related('bus')
    serializer_class = MaintenanceLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filterset_fields = ['bus']
    ordering_fields = ['date', 'cost']
