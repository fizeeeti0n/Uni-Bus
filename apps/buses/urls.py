"""buses/urls.py"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusViewSet, TripViewSet, DelayReportViewSet

router = DefaultRouter()
router.register('trips',  TripViewSet,        basename='trip')
router.register('delays', DelayReportViewSet, basename='delay')
router.register('',       BusViewSet,         basename='bus')

urlpatterns = [path('', include(router.urls))]
