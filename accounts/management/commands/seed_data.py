"""
Management command: python manage.py seed_data
Populates the database with sample UniBus data for development/testing.
"""

from django.core.management.base import BaseCommand

from django.utils import timezone
import datetime


class Command(BaseCommand):
    help = 'Seed the database with sample UniBus data'

    def handle(self, *args, **options):
        self._create_users()
        self._create_stops()
        self._create_routes()
        self._create_buses()
        self._create_schedules()
        self.stdout.write(self.style.SUCCESS('✅ Seed data created successfully!'))

    def _create_users(self):
        from apps.accounts.models import User, StudentProfile, DriverProfile

        # Admin
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults=dict(email='admin@unibus.edu', role='admin', is_staff=True, is_superuser=True)
        )
        admin.set_password('admin123')
        admin.save()

        # Drivers
        driver_data = [
            ('driver1', 'Karim', 'Hossain', 'DL-001-2023'),
            ('driver2', 'Rahim', 'Islam',   'DL-002-2023'),
        ]
        for username, first, last, lic in driver_data:
            u, created = User.objects.get_or_create(
                username=username,
                defaults=dict(first_name=first, last_name=last, role='driver', email=f'{username}@unibus.edu')
            )
            if created:
                u.set_password('driver123')
                u.save()
                DriverProfile.objects.create(user=u, license_number=lic)

        # Students
        student_data = [
            ('student1', 'Ayesha', 'Rahman', 'CSE-001'),
            ('student2', 'Tanvir', 'Ahmed',  'EEE-002'),
            ('student3', 'Nusrat', 'Jahan',  'BBA-003'),
        ]
        for username, first, last, sid in student_data:
            u, created = User.objects.get_or_create(
                username=username,
                defaults=dict(first_name=first, last_name=last, role='student',
                              email=f'{username}@unibus.edu', student_id=sid)
            )
            if created:
                u.set_password('student123')
                u.save()
                StudentProfile.objects.create(user=u, department='CSE', semester=5)

        self.stdout.write('  👤 Users created')

    def _create_stops(self):
        from apps.routes.models import Stop

        stops_data = [
            ('University Gate',    23.8731, 90.3976),
            ('Mirpur 10',          23.8069, 90.3680),
            ('Mirpur 12',          23.8232, 90.3643),
            ('Dhanmondi 27',       23.7479, 90.3766),
            ('Shyamoli',           23.7742, 90.3647),
            ('Kalyanpur',          23.7891, 90.3598),
            ('Technical',          23.7701, 90.3576),
            ('Agargaon',           23.7800, 90.3769),
            ('Science Lab',        23.7519, 90.3877),
            ('Mohammadpur',        23.7643, 90.3574),
        ]

        for name, lat, lng in stops_data:
            Stop.objects.get_or_create(
                name=name,
                defaults=dict(location=Point(lng, lat, srid=4326), address=f'{name}, Dhaka')
            )

        self.stdout.write('  🛑 Stops created')

    def _create_routes(self):
        from apps.routes.models import Route, RouteStop, Stop

        # Route A: Mirpur ↔ University
        route_a, _ = Route.objects.get_or_create(
            name='Route A — Mirpur',
            defaults=dict(direction='inbound', total_km=12.5)
        )
        stop_names_a = ['Mirpur 12', 'Mirpur 10', 'Kalyanpur', 'Shyamoli', 'Technical', 'University Gate']
        for order, sname in enumerate(stop_names_a, start=1):
            try:
                stop = Stop.objects.get(name=sname)
                RouteStop.objects.get_or_create(route=route_a, stop=stop, defaults={'order': order, 'time_offset': order * 5})
            except Stop.DoesNotExist:
                pass

        # Route B: Dhanmondi ↔ University
        route_b, _ = Route.objects.get_or_create(
            name='Route B — Dhanmondi',
            defaults=dict(direction='inbound', total_km=9.3)
        )
        stop_names_b = ['Dhanmondi 27', 'Science Lab', 'Mohammadpur', 'Agargaon', 'University Gate']
        for order, sname in enumerate(stop_names_b, start=1):
            try:
                stop = Stop.objects.get(name=sname)
                RouteStop.objects.get_or_create(route=route_b, stop=stop, defaults={'order': order, 'time_offset': order * 4})
            except Stop.DoesNotExist:
                pass

        self.stdout.write('  🗺️  Routes created')

    def _create_buses(self):
        from apps.buses.models import Bus
        from apps.accounts.models import DriverProfile

        buses_data = [
            ('BUS-001', 'DHA-METRO-1111', 'Hino Bus', 45),
            ('BUS-002', 'DHA-METRO-2222', 'Tata Bus',  40),
            ('BUS-003', 'DHA-METRO-3333', 'Ashok Leyland', 50),
        ]
        for num, reg, model, cap in buses_data:
            Bus.objects.get_or_create(
                bus_number=num,
                defaults=dict(registration_no=reg, model=model, capacity=cap, status='active')
            )

        # Assign first bus to first driver
        try:
            bus = Bus.objects.get(bus_number='BUS-001')
            driver = DriverProfile.objects.get(license_number='DL-001-2023')
            driver.assigned_bus = bus
            driver.save()
        except Exception:
            pass

        self.stdout.write('  🚌 Buses created')

    def _create_schedules(self):
        from apps.schedules.models import Schedule
        from apps.routes.models import Route
        from apps.buses.models import Bus

        try:
            route_a = Route.objects.get(name='Route A — Mirpur')
            route_b = Route.objects.get(name='Route B — Dhanmondi')
            bus1 = Bus.objects.get(bus_number='BUS-001')
            bus2 = Bus.objects.get(bus_number='BUS-002')
        except Exception:
            return

        schedules = [
            (route_a, bus1, datetime.time(7,  30), datetime.time(8,  30), 'weekday'),
            (route_a, bus1, datetime.time(14, 00), datetime.time(15, 00), 'weekday'),
            (route_b, bus2, datetime.time(7,  45), datetime.time(8,  30), 'weekday'),
            (route_b, bus2, datetime.time(14, 30), datetime.time(15, 15), 'weekday'),
            (route_a, bus1, datetime.time(9,  00), datetime.time(10, 00), 'saturday'),
        ]
        for route, bus, dep, arr, day in schedules:
            Schedule.objects.get_or_create(
                route=route, bus=bus, departure_time=dep, day_type=day,
                defaults=dict(arrival_time=arr, is_active=True)
            )

        self.stdout.write('  🕐 Schedules created')
