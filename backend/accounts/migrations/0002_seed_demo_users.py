from django.db import migrations
from django.contrib.auth.hashers import make_password


def seed_users(apps, schema_editor):
    User = apps.get_model('accounts', 'User')

    users_data = [
        {
            'name': 'System Administrator',
            'email': 'admin@example.com',
            'password': make_password('Admin@123'),
            'role': 'agent',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
        },
        {
            'name': 'Bob Agent',
            'email': 'agent@example.com',
            'password': make_password('Agent@123'),
            'role': 'agent',
            'is_staff': True,
            'is_superuser': False,
            'is_active': True,
        },
        {
            'name': 'Sarah Jenkins',
            'email': 'sarah.agent@example.com',
            'password': make_password('Agent@123'),
            'role': 'agent',
            'is_staff': True,
            'is_superuser': False,
            'is_active': True,
        },
        {
            'name': 'John Doe',
            'email': 'customer@example.com',
            'password': make_password('Customer@123'),
            'role': 'customer',
            'is_staff': False,
            'is_superuser': False,
            'is_active': True,
        },
        {
            'name': 'Alice Smith',
            'email': 'alice@example.com',
            'password': make_password('Customer@123'),
            'role': 'customer',
            'is_staff': False,
            'is_superuser': False,
            'is_active': True,
        },
    ]

    for data in users_data:
        User.objects.update_or_create(
            email=data['email'],
            defaults=data
        )


def reverse_seed(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    User.objects.filter(email__in=[
        'admin@example.com',
        'agent@example.com',
        'sarah.agent@example.com',
        'customer@example.com',
        'alice@example.com'
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_users, reverse_seed),
    ]
