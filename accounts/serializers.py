"""accounts/serializers.py"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User, StudentProfile, DriverProfile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role']     = user.role
        token['username'] = user.username
        token['email']    = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id':         self.user.id,
            'username':   self.user.username,
            'email':      self.user.email,
            'role':       self.user.role,
            'full_name':  self.user.get_full_name(),
        }
        return data


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudentProfile
        fields = ['department', 'semester', 'batch', 'home_stop']


class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DriverProfile
        fields = ['license_number', 'license_expiry', 'experience_years', 'assigned_bus', 'is_on_duty']


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    driver_profile  = DriverProfileSerializer(read_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'student_id', 'profile_picture',
            'is_verified', 'student_profile', 'driver_profile',
            'created_at',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'student_id', 'password', 'password2',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        if user.role == User.Role.STUDENT:
            StudentProfile.objects.create(user=user)
        elif user.role == User.Role.DRIVER:
            DriverProfile.objects.create(user=user, license_number='PENDING')
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
