"""
buses/models.py
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Bus(models.Model):
    STATUS_CHOICES = [
        ('active',      'Active / On Route'),
        ('idle',        'Idle'),
        ('maintenance', 'Under Maintenance'),
        ('out_of_service', 'Out of Service'),
    ]

    bus_number    = models.CharField(max_length=20, unique=True)
    license_plate = models.CharField(max_length=20, unique=True)
    capacity      = models.PositiveSmallIntegerField(default=40)
    model         = models.CharField(max_length=100, blank=True)
    year          = models.PositiveSmallIntegerField(null=True, blank=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='idle')
    route         = models.ForeignKey(
        'routes.Route', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='buses'
    )
    driver        = models.OneToOneField(
        'accounts.DriverProfile', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='bus'
    )
    current_stop  = models.ForeignKey(
        'routes.BusStop', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='current_buses'
    )
    # Live GPS (updated by driver's device or tracking consumer)
    current_lat   = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_lng   = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_speed = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    heading       = models.SmallIntegerField(default=0, help_text='Degrees 0-359')
    last_gps_update = models.DateTimeField(null=True, blank=True)

    # Passenger tracking
    current_passengers = models.PositiveSmallIntegerField(default=0)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table  = 'buses'
        ordering  = ['bus_number']
        verbose_name_plural = 'Buses'

    def __str__(self):
        return f'{self.bus_number} ({self.get_status_display()})'

    @property
    def occupancy_percent(self):
        if self.capacity == 0:
            return 0
        return round((self.current_passengers / self.capacity) * 100)

    @property
    def occupancy_label(self):
        pct = self.occupancy_percent
        if pct >= 90:
            return 'full'
        elif pct >= 60:
            return 'near-full'
        return 'available'

    @property
    def coords(self):
        if self.current_lat and self.current_lng:
            return {'lat': float(self.current_lat), 'lng': float(self.current_lng)}
        return None

    def start_trip(self):
        self.status = 'active'
        self.save(update_fields=['status', 'updated_at'])

    def end_trip(self):
        self.status = 'idle'
        self.current_passengers = 0
        self.save(update_fields=['status', 'current_passengers', 'updated_at'])


class BusMaintenanceLog(models.Model):
    bus         = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='maintenance_logs')
    description = models.TextField()
    performed_by = models.CharField(max_length=120)
    date        = models.DateField()
    cost        = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    next_service = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bus_maintenance_logs'
        ordering = ['-date']

    def __str__(self):
        return f'{self.bus.bus_number} – {self.date}'


class Trip(models.Model):
    """Records each completed trip for analytics."""
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed',   'Completed'),
        ('cancelled',   'Cancelled'),
    ]

    bus        = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='trips')
    driver     = models.ForeignKey(
        'accounts.DriverProfile', on_delete=models.CASCADE, related_name='trips'
    )
    route      = models.ForeignKey('routes.Route', on_delete=models.CASCADE, related_name='trips')
    status     = models.CharField(max_length=15, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at   = models.DateTimeField(null=True, blank=True)
    total_passengers = models.PositiveSmallIntegerField(default=0)
    delay_minutes    = models.SmallIntegerField(default=0)
    notes            = models.TextField(blank=True)

    class Meta:
        db_table  = 'trips'
        ordering  = ['-started_at']

    def __str__(self):
        return f'Trip {self.id}: {self.bus.bus_number} on {self.route.name}'

    @property
    def duration_minutes(self):
        if self.ended_at and self.started_at:
            delta = self.ended_at - self.started_at
            return int(delta.total_seconds() / 60)
        return None


class DelayReport(models.Model):
    REASON_CHOICES = [
        ('traffic',     'Heavy Traffic'),
        ('construction','Road Construction'),
        ('mechanical',  'Vehicle Maintenance Issue'),
        ('weather',     'Weather Conditions'),
        ('accident',    'Accident on Route'),
        ('other',       'Other'),
    ]

    trip           = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='delay_reports', null=True, blank=True)
    bus            = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='delay_reports')
    delay_minutes  = models.PositiveSmallIntegerField()
    reason         = models.CharField(max_length=20, choices=REASON_CHOICES)
    notes          = models.TextField(blank=True)
    reported_at    = models.DateTimeField(auto_now_add=True)
    notified_students = models.BooleanField(default=False)

    class Meta:
        db_table = 'delay_reports'
        ordering = ['-reported_at']

    def __str__(self):
        return f'{self.bus.bus_number} delayed {self.delay_minutes}m – {self.get_reason_display()}'
