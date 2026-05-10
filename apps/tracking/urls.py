"""tracking/urls.py"""
from django.urls import path
from .views import MapConfigView, ETAView, RouteETAView, geocode_search

urlpatterns = [
    path('map-config/',                     MapConfigView.as_view(),  name='map-config'),
    path('eta/<int:bus_id>/<int:stop_id>/', ETAView.as_view(),        name='eta'),
    path('route-eta/<int:bus_id>/',         RouteETAView.as_view(),   name='route-eta'),
    path('geocode/',                        geocode_search,           name='geocode'),
]
