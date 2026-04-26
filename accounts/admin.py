# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, DriverProfile


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'
    fk_name = 'user'


class DriverProfileInline(admin.StackedInline):
    model = DriverProfile
    can_delete = False
    verbose_name_plural = 'Driver Profile'
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['username', 'email', 'get_full_name', 'role', 'is_verified', 'is_active', 'created_at']
    list_filter   = ['role', 'is_verified', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'student_id']
    ordering      = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('UniBus Info', {
            'fields': ('role', 'phone_number', 'student_id', 'profile_picture', 'fcm_token', 'is_verified')
        }),
    )

    def get_inlines(self, request, obj=None):
        if obj:
            if obj.role == User.Role.STUDENT:
                return [StudentProfileInline]
            elif obj.role == User.Role.DRIVER:
                return [DriverProfileInline]
        return []


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'department', 'semester', 'batch']
    search_fields = ['user__username', 'department', 'batch']


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display  = ['user', 'license_number', 'license_expiry', 'assigned_bus', 'is_on_duty']
    list_filter   = ['is_on_duty']
    search_fields = ['user__username', 'license_number']
