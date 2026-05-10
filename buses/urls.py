# buses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusViewSet, MaintenanceLogViewSet

router = DefaultRouter()
router.register('maintenance', MaintenanceLogViewSet, basename='maintenance')
router.register('', BusViewSet, basename='bus')

urlpatterns = [path('', include(router.urls))]
