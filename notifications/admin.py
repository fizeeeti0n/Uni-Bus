# notifications/admin.py
from django.contrib import admin
from .models import Notification, UserNotification


class UserNotificationInline(admin.TabularInline):
    model      = UserNotification
    extra      = 0
    readonly_fields = ['user', 'is_read', 'read_at', 'created_at']
    can_delete = False


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'route', 'is_broadcast', 'created_by', 'created_at']
    list_filter   = ['category', 'is_broadcast']
    search_fields = ['title', 'body']
    ordering      = ['-created_at']
    inlines       = [UserNotificationInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
        if not change:
            from .service import dispatch_notification
            dispatch_notification(obj)


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display  = ['user', 'notification', 'is_read', 'read_at', 'created_at']
    list_filter   = ['is_read']
    search_fields = ['user__username', 'notification__title']
    ordering      = ['-created_at']
