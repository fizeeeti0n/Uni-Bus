# buses/admin.py
from django.contrib import admin
from .models import Bus, BusMaintenanceLog


class MaintenanceLogInline(admin.TabularInline):
    model   = BusMaintenanceLog
    extra   = 0
    ordering = ['-date']


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display  = ['bus_number', 'registration_no', 'model', 'capacity', 'status', 'has_ac', 'last_service_date']
    list_filter   = ['status', 'has_ac']
    search_fields = ['bus_number', 'registration_no', 'model']
    inlines       = [MaintenanceLogInline]


@admin.register(BusMaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display  = ['bus', 'date', 'description', 'cost', 'technician', 'next_service']
    list_filter   = ['bus']
    ordering      = ['-date']
    search_fields = ['bus__bus_number', 'description', 'technician']
