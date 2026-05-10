"""
Management command: python manage.py seed_demo_data
Creates demo buses, routes, stops, drivers and a test admin account.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with demo data for UniBus'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding UniBus demo data...')

        self._create_stops()
        self._create_routes()
        self._create_users()
        self._create_buses()

        self.stdout.write(self.style.SUCCESS('\n✅ Demo data seeded successfully!'))
        self.stdout.write('\nDemo credentials:')
        self.stdout.write('  Admin:   admin@unibus.edu   / Admin@2026')
        self.stdout.write('  Driver:  driver1@unibus.edu / Driver@2026')
        self.stdout.write('  Student: student1@unibus.edu / Student@2026')

    def _create_stops(self):
        from apps.routes.models import BusStop
        stops_data = [
            # Dhaka University area
            {'name': 'Main Gate',         'latitude': 23.7268, 'longitude': 90.3954, 'landmark': 'University main entrance'},
            {'name': 'Academic Building', 'latitude': 23.7285, 'longitude': 90.3975, 'landmark': 'Near admin block'},
            {'name': 'Student Center',    'latitude': 23.7302, 'longitude': 90.3962, 'landmark': 'TSC'},
            {'name': 'Dormitory A',       'latitude': 23.7320, 'longitude': 90.3948, 'landmark': 'Hall area'},
            {'name': 'North Gate',        'latitude': 23.7340, 'longitude': 90.3970, 'landmark': 'Nilkhet side'},
            {'name': 'Library',           'latitude': 23.7275, 'longitude': 90.3990, 'landmark': 'Central Library'},
            {'name': 'Sports Complex',    'latitude': 23.7260, 'longitude': 90.3935, 'landmark': 'Stadium'},
            {'name': 'Medical Center',    'latitude': 23.7290, 'longitude': 90.3920, 'landmark': 'University hospital'},
            {'name': 'East Gate',         'latitude': 23.7255, 'longitude': 90.4010, 'landmark': 'Shahbag side'},
            {'name': 'Cafeteria',         'latitude': 23.7270, 'longitude': 90.3965, 'landmark': 'Main canteen'},
            {'name': 'Admin Building',    'latitude': 23.7295, 'longitude': 90.3985, 'landmark': 'Vice Chancellor office'},
            {'name': 'Parking Lot',       'latitude': 23.7310, 'longitude': 90.3930, 'landmark': 'Bus parking'},
        ]
        self.stops = {}
        for sd in stops_data:
            stop, _ = BusStop.objects.get_or_create(name=sd['name'], defaults=sd)
            self.stops[stop.name] = stop
        self.stdout.write(f'  ✓ {len(self.stops)} bus stops')

    def _create_routes(self):
        from apps.routes.models import Route, RouteStop, Schedule
        import datetime

        routes_config = [
            {
                'name': 'Route A', 'description': 'Main Gate → Academic → Student Center → Dormitory',
                'avg_duration': 35, 'color': '#2563eb',
                'stops': ['Main Gate', 'Academic Building', 'Student Center', 'Dormitory A'],
                'offsets': [0, 8, 18, 35],
            },
            {
                'name': 'Route B', 'description': 'North Gate → Library → Sports Complex → Medical Center',
                'avg_duration': 42, 'color': '#16a34a',
                'stops': ['North Gate', 'Library', 'Sports Complex', 'Medical Center'],
                'offsets': [0, 10, 25, 42],
            },
            {
                'name': 'Route C', 'description': 'East Gate → Cafeteria → Admin Building → Parking Lot',
                'avg_duration': 28, 'color': '#dc2626',
                'stops': ['East Gate', 'Cafeteria', 'Admin Building', 'Parking Lot'],
                'offsets': [0, 7, 18, 28],
            },
        ]
        self.routes = {}
        for rc in routes_config:
            route, _ = Route.objects.get_or_create(name=rc['name'], defaults={
                'description': rc['description'],
                'avg_duration': rc['avg_duration'],
                'color': rc['color'],
            })
            self.routes[route.name] = route

            for i, (stop_name, offset) in enumerate(zip(rc['stops'], rc['offsets'])):
                RouteStop.objects.get_or_create(
                    route=route, order=i+1,
                    defaults={'stop': self.stops[stop_name], 'minutes_offset': offset}
                )

            # Schedule: Mon–Fri 7am, 9am, 12pm, 3pm, 5pm
            for day in range(5):
                for hour in [7, 9, 12, 15, 17]:
                    Schedule.objects.get_or_create(
                        route=route, day_of_week=day,
                        departure_time=datetime.time(hour, 0),
                        defaults={'is_active': True}
                    )

        self.stdout.write(f'  ✓ {len(self.routes)} routes with stops and schedules')

    def _create_users(self):
        from apps.accounts.models import StudentProfile, DriverProfile

        # Admin
        admin, created = User.objects.get_or_create(
            email='admin@unibus.edu',
            defaults={'first_name': 'Super', 'last_name': 'Admin',
                      'role': 'admin', 'is_staff': True, 'is_superuser': True}
        )
        if created:
            admin.set_password('Admin@2026')
            admin.save()

        # Drivers
        self.drivers = []
        for i in range(1, 5):
            user, created = User.objects.get_or_create(
                email=f'driver{i}@unibus.edu',
                defaults={'first_name': f'Driver', 'last_name': f'#{100+i}', 'role': 'driver'}
            )
            if created:
                user.set_password('Driver@2026')
                user.save()
            driver, _ = DriverProfile.objects.get_or_create(
                user=user, defaults={'license_number': f'DL-10000{i}'}
            )
            self.drivers.append(driver)

        # Students
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                email=f'student{i}@unibus.edu',
                defaults={'first_name': f'Student', 'last_name': f'{i}', 'role': 'student'}
            )
            if created:
                user.set_password('Student@2026')
                user.save()
                StudentProfile.objects.create(
                    user=user,
                    student_id=f'STU-2026-{i:04d}',
                    department='Computer Science',
                    year='3rd Year',
                    home_stop=list(self.stops.values())[i % len(self.stops)],
                )

        self.stdout.write('  ✓ Admin, 4 drivers, 3 students created')

    def _create_buses(self):
        from apps.buses.models import Bus

        buses_data = [
            {'bus_number': 'BUS-101', 'license_plate': 'DHA-1001', 'capacity': 40,
             'route': 'Route A', 'driver_idx': 0,
             'current_lat': 23.7268, 'current_lng': 90.3954, 'status': 'active'},
            {'bus_number': 'BUS-102', 'license_plate': 'DHA-1002', 'capacity': 40,
             'route': 'Route B', 'driver_idx': 1,
             'current_lat': 23.7340, 'current_lng': 90.3970, 'status': 'active'},
            {'bus_number': 'BUS-103', 'license_plate': 'DHA-1003', 'capacity': 35,
             'route': 'Route A', 'driver_idx': 2,
             'current_lat': 23.7302, 'current_lng': 90.3962, 'status': 'active'},
            {'bus_number': 'BUS-104', 'license_plate': 'DHA-1004', 'capacity': 40,
             'route': 'Route C', 'driver_idx': 3,
             'current_lat': 23.7255, 'current_lng': 90.4010, 'status': 'idle'},
            {'bus_number': 'BUS-105', 'license_plate': 'DHA-1005', 'capacity': 45,
             'route': None, 'driver_idx': None,
             'current_lat': None, 'current_lng': None, 'status': 'maintenance'},
        ]

        from django.utils import timezone
        for bd in buses_data:
            route  = self.routes.get(bd['route']) if bd['route'] else None
            driver = self.drivers[bd['driver_idx']] if bd['driver_idx'] is not None else None
            bus, _ = Bus.objects.get_or_create(
                bus_number=bd['bus_number'],
                defaults={
                    'license_plate':  bd['license_plate'],
                    'capacity':       bd['capacity'],
                    'status':         bd['status'],
                    'route':          route,
                    'driver':         driver,
                    'current_lat':    bd['current_lat'],
                    'current_lng':    bd['current_lng'],
                    'current_passengers': 15 if bd['status'] == 'active' else 0,
                    'last_gps_update': timezone.now() if bd['status'] == 'active' else None,
                }
            )

        self.stdout.write(f'  ✓ {len(buses_data)} buses created')
