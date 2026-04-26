# accounts/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, RegisterView, LogoutView, ProfileView, ChangePasswordView, UserViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')

urlpatterns = [
    path('login/',           LoginView.as_view(),          name='login'),
    path('register/',        RegisterView.as_view(),        name='register'),
    path('logout/',          LogoutView.as_view(),          name='logout'),
    path('profile/',         ProfileView.as_view(),         name='profile'),
    path('change-password/', ChangePasswordView.as_view(),  name='change-password'),
    path('',                 include(router.urls)),
]
