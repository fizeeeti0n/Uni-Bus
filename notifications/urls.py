# notifications/urls.py
from django.urls import path
from .views import (
    MyNotificationsView, MarkNotificationReadView,
    MarkAllReadView, BroadcastNotificationView, UnreadCountView,
)

urlpatterns = [
    path('',                       MyNotificationsView.as_view(),       name='my-notifications'),
    path('unread-count/',          UnreadCountView.as_view(),            name='unread-count'),
    path('<int:pk>/read/',         MarkNotificationReadView.as_view(),   name='mark-read'),
    path('mark-all-read/',         MarkAllReadView.as_view(),            name='mark-all-read'),
    path('broadcast/',             BroadcastNotificationView.as_view(),  name='broadcast'),
]
