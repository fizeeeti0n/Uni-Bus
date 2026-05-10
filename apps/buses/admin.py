from django.contrib import admin
from .models import Bus, Trip, DelayReport, BusMaintenanceLog

class MaintenanceInline(admin.TabularInline):
    model = BusMaintenanceLog
    extra = 0

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display  = ['bus_number', 'license_plate', 'status', 'route', 'driver', 'current_passengers', 'capacity']
    list_filter   = ['status', 'route']
    search_fields = ['bus_number', 'license_plate']
    inlines       = [MaintenanceInline]

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['bus', 'route', 'driver', 'status', 'started_at', 'ended_at', 'delay_minutes']
    list_filter  = ['status', 'route']
    date_hierarchy = 'started_at'

@admin.register(DelayReport)
class DelayReportAdmin(admin.ModelAdmin):
    list_display = ['bus', 'delay_minutes', 'reason', 'reported_at', 'notified_students']
    list_filter  = ['reason', 'notified_students']
