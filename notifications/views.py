"""notifications/views.py"""

from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification, UserNotification
from .serializers import NotificationSerializer, UserNotificationSerializer
from .service import dispatch_notification
from apps.accounts.permissions import IsAdminUser


class MyNotificationsView(generics.ListAPIView):
    """List all notifications for the authenticated user."""
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserNotification.objects.filter(
            user=self.request.user
        ).select_related('notification').order_by('-created_at')


class MarkNotificationReadView(APIView):
    """Mark a single notification as read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            un = UserNotification.objects.get(pk=pk, user=request.user)
            un.is_read = True
            un.read_at = timezone.now()
            un.save(update_fields=['is_read', 'read_at'])
            return Response({'detail': 'Marked as read.'})
        except UserNotification.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)


class MarkAllReadView(APIView):
    """Mark all unread notifications as read."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = UserNotification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True, read_at=timezone.now())
        return Response({'detail': f'{updated} notifications marked as read.'})


class BroadcastNotificationView(APIView):
    """Admin: Create and immediately dispatch a notification."""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notif = serializer.save(created_by=request.user)
        dispatch_notification(notif)
        return Response(NotificationSerializer(notif).data, status=status.HTTP_201_CREATED)


class UnreadCountView(APIView):
    """Quick unread count badge for the mobile app."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = UserNotification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})
