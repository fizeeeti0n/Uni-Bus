"""buses/models.py"""

from django.db import models


class Bus(models.Model):
    class Status(models.TextChoices):
        ACTIVE      = 'active',      'Active'
        INACTIVE    = 'inactive',    'Inactive'
        MAINTENANCE = 'maintenance', 'Under Maintenance'
        RETIRED     = 'retired',     'Retired'

    bus_number       = models.CharField(max_length=20, unique=True)
    registration_no  = models.CharField(max_length=30, unique=True)
    model            = models.CharField(max_length=100, blank=True)
    capacity         = models.PositiveSmallIntegerField(default=40)
    status           = models.CharField(max_length=15, choices=Status.choices, default=Status.ACTIVE)
    has_ac           = models.BooleanField(default=False)
    manufacture_year = models.PositiveSmallIntegerField(null=True, blank=True)
    last_service_date = models.DateField(null=True, blank=True)
    photo            = models.ImageField(upload_to='buses/', null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering  = ['bus_number']
        verbose_name_plural = 'Buses'

    def __str__(self):
        return f"Bus {self.bus_number}"


class BusMaintenanceLog(models.Model):
    bus         = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='maintenance_logs')
    date        = models.DateField()
    description = models.TextField()
    cost        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    technician  = models.CharField(max_length=100, blank=True)
    next_service = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.bus} maintenance on {self.date}"
