"""notifications/serializers.py"""

from rest_framework import serializers
from .models import Notification, UserNotification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'title', 'body', 'category', 'route', 'trip', 'is_broadcast', 'created_at']
        read_only_fields = ['created_at']


class UserNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model  = UserNotification
        fields = ['id', 'notification', 'is_read', 'read_at', 'created_at']
