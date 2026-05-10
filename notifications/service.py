"""notifications/service.py — Firebase push notification dispatcher"""

import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import Notification, UserNotification

logger = logging.getLogger(__name__)
User = get_user_model()


def _get_firebase_app():
    """Lazy-init Firebase Admin SDK."""
    try:
        import firebase_admin
        from firebase_admin import credentials
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
        return firebase_admin
    except Exception as e:
        logger.warning(f"Firebase init failed: {e}")
        return None


def send_push_notification(tokens: list, title: str, body: str, data: dict = None):
    """Send FCM push notification to a list of device tokens."""
    if not tokens:
        return
    try:
        from firebase_admin import messaging
        _get_firebase_app()
        messages = [
            messaging.Message(
                notification=messaging.Notification(title=title, body=body),
                data={str(k): str(v) for k, v in (data or {}).items()},
                token=token,
            )
            for token in tokens if token
        ]
        if messages:
            response = messaging.send_each(messages)
            logger.info(f"FCM: {response.success_count} sent, {response.failure_count} failed")
    except Exception as e:
        logger.error(f"FCM send error: {e}")


def dispatch_notification(notification: Notification):
    """
    Determine recipients, create UserNotification rows, and push FCM.
    """
    if notification.is_broadcast:
        users = User.objects.filter(is_active=True)
    elif notification.route:
        # All students whose home stop is on this route
        from apps.routes.models import RouteStop
        stop_ids = RouteStop.objects.filter(route=notification.route).values_list('stop_id', flat=True)
        users = User.objects.filter(
            student_profile__home_stop_id__in=stop_ids, is_active=True
        )
    else:
        users = User.objects.none()

    # Bulk-create UserNotification records
    user_notifs = [
        UserNotification(user=u, notification=notification)
        for u in users
    ]
    UserNotification.objects.bulk_create(user_notifs, ignore_conflicts=True)

    # Collect FCM tokens and fire push
    tokens = list(users.exclude(fcm_token='').values_list('fcm_token', flat=True))
    send_push_notification(
        tokens=tokens,
        title=notification.title,
        body=notification.body,
        data={
            'category':  notification.category,
            'route_id':  str(notification.route_id or ''),
            'trip_id':   str(notification.trip_id or ''),
        }
    )
