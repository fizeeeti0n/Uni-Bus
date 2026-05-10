"""apps/frontend/urls.py"""
from django.urls import path
from . import views

urlpatterns = [
    path('',                    views.home,             name='home'),
    path('about/',              views.about,            name='about'),
    path('login/',              views.login_page,       name='login'),
    path('register/',           views.register_page,    name='register'),
    path('forgot-password/',    views.forgot_pass,      name='forgot-password'),
    path('student/',            views.student,          name='student'),
    path('student/profile/',    views.student_profile,  name='student-profile'),
    path('student/notifications/', views.notifications, name='notifications'),
    path('driver/',             views.driver,           name='driver'),
    path('admin-login/',        views.admin_login,      name='admin-login'),
    path('dashboard/',          views.admin_dash,       name='admin-dashboard'),
    path('dashboard/analytics/',views.admin_analytics,  name='admin-analytics'),
]

handler404 = 'apps.frontend.views.not_found'
