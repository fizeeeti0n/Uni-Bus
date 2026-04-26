"""
accounts/models.py
Custom User model for UniBus — supports Student, Driver, Admin roles
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django_mongodb_backend.fields import ObjectIdAutoField


class User(AbstractUser):
    # Explicitly define the ID for MongoDB compatibility
    id = ObjectIdAutoField(primary_key=True)

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        DRIVER  = 'driver',  'Driver'
        ADMIN   = 'admin',   'Admin'

    role            = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    phone_number    = models.CharField(max_length=15, blank=True)
    student_id      = models.CharField(max_length=20, blank=True, unique=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    fcm_token       = models.TextField(blank=True, help_text='Firebase Cloud Messaging token for push notifications')
    is_verified     = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # FIX: Strip force_update/force_insert which crashes MongoDB backend
        kwargs.pop('force_update', None)
        kwargs.pop('force_insert', None)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_driver(self):
        return self.role == self.Role.DRIVER

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN


class StudentProfile(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    department = models.CharField(max_length=100, blank=True)
    semester   = models.PositiveSmallIntegerField(null=True, blank=True)
    batch      = models.CharField(max_length=20, blank=True)
    home_stop  = models.ForeignKey(
        'routes.Stop', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='home_students'
    )

    def save(self, *args, **kwargs):
        kwargs.pop('force_update', None)
        kwargs.pop('force_insert', None)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profile: {self.user.username}"


class DriverProfile(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user            = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    license_number  = models.CharField(max_length=30, unique=True)
    license_expiry  = models.DateField(null=True, blank=True)
    assigned_bus    = models.OneToOneField(
        'buses.Bus', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='assigned_driver'
    )
    experience_years = models.PositiveSmallIntegerField(default=0)
    is_on_duty      = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        kwargs.pop('force_update', None)
        kwargs.pop('force_insert', None)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Driver: {self.user.get_full_name()}"