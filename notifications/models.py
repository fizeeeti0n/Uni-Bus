"""notifications/models.py"""

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    class Category(models.TextChoices):
        DELAY       = 'delay',       'Bus Delay'
        CANCEL      = 'cancel',      'Trip Cancelled'
        ARRIVAL     = 'arrival',     'Bus Arriving'
        GENERAL     = 'general',     'General'
        MAINTENANCE = 'maintenance', 'Maintenance Alert'
        EMERGENCY   = 'emergency',   'Emergency'

    title       = models.CharField(max_length=200)
    body        = models.TextField()
    category    = models.CharField(max_length=15, choices=Category.choices, default=Category.GENERAL)
    # If route/trip is specified, push to all users on that route
    route       = models.ForeignKey('routes.Route', null=True, blank=True, on_delete=models.SET_NULL)
    trip        = models.ForeignKey('schedules.Trip', null=True, blank=True, on_delete=models.SET_NULL)
    is_broadcast = models.BooleanField(default=False, help_text='Send to all users')
    created_by  = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='sent_notifications')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title}"


class UserNotification(models.Model):
    """Per-user read/unread tracking"""
    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read      = models.BooleanField(default=False)
    read_at      = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering        = ['-created_at']
        unique_together = [('user', 'notification')]

    def __str__(self):
        return f"{self.user.username} — {self.notification.title}"
