"""apps/frontend/views.py — serves all HTML pages as Django templates"""
from django.shortcuts import render
from django.conf import settings


def _ctx():
    """Common template context injected into every page."""
    return {
        'MAP_TILE_URL':         settings.MAP_TILE_URL,
        'MAP_TILE_ATTRIBUTION': settings.MAP_TILE_ATTRIBUTION,
        'MAP_DEFAULT_LAT':      settings.MAP_DEFAULT_LAT,
        'MAP_DEFAULT_LNG':      settings.MAP_DEFAULT_LNG,
        'MAP_DEFAULT_ZOOM':     settings.MAP_DEFAULT_ZOOM,
        'OSRM_API_URL':         settings.OSRM_API_URL,
    }


def home(request):           return render(request, 'frontend/home.html',            _ctx())
def about(request):          return render(request, 'frontend/about.html',           _ctx())
def login_page(request):     return render(request, 'frontend/login.html',           _ctx())
def register_page(request):  return render(request, 'frontend/register.html',        _ctx())
def forgot_pass(request):    return render(request, 'frontend/forgot_password.html', _ctx())
def student(request):        return render(request, 'frontend/student.html',         _ctx())
def student_profile(request):return render(request, 'frontend/student_profile.html', _ctx())
def notifications(request):  return render(request, 'frontend/notifications.html',   _ctx())
def driver(request):         return render(request, 'frontend/driver.html',          _ctx())
def admin_login(request):    return render(request, 'frontend/admin_login.html',     _ctx())
def admin_dash(request):     return render(request, 'frontend/admin.html',           _ctx())
def admin_analytics(request):return render(request, 'frontend/admin_analytics.html', _ctx())
def not_found(request):      return render(request, 'frontend/404.html',             _ctx(), status=404)


def not_found(request, exception):
    context = _ctx()
    context['error_message'] = str(exception)
    return render(request, 'frontend/404.html', context, status=404)