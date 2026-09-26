from django.core.management.base import BaseCommand
from accounts.models import User
from tickets.models import Ticket, TicketComment


class Command(BaseCommand):
    help = 'Seeds database with initial support agents, customer accounts, and tickets.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database with demo data...')

        # 1. Admin / Superuser
        admin, _ = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'name': 'System Administrator',
                'role': 'agent',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin.set_password('Admin@123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.role = 'agent'
        admin.save()

        # 2. Support Agents
        agent1, _ = User.objects.get_or_create(
            email='agent@example.com',
            defaults={
                'name': 'Bob Agent',
                'role': 'agent',
                'is_staff': True,
            }
        )
        agent1.set_password('Agent@123')
        agent1.save()

        agent2, _ = User.objects.get_or_create(
            email='sarah.agent@example.com',
            defaults={
                'name': 'Sarah Jenkins',
                'role': 'agent',
                'is_staff': True,
            }
        )
        agent2.set_password('Agent@123')
        agent2.save()

        # 3. Customers
        customer1, _ = User.objects.get_or_create(
            email='customer@example.com',
            defaults={
                'name': 'John Doe',
                'role': 'customer',
            }
        )
        customer1.set_password('Customer@123')
        customer1.save()

        customer2, _ = User.objects.get_or_create(
            email='alice@example.com',
            defaults={
                'name': 'Alice Smith',
                'role': 'customer',
            }
        )
        customer2.set_password('Customer@123')
        customer2.save()

        # 4. Sample Tickets
        t1, _ = Ticket.objects.get_or_create(
            subject='Cannot connect to MySQL database service',
            user=customer1,
            defaults={
                'description': 'Getting connection refused error when attempting to connect to port 3306.',
                'priority': 'high',
                'status': 'open',
                'assigned_to': None,
            }
        )

        t2, _ = Ticket.objects.get_or_create(
            subject='Billing invoice inquiry for March',
            user=customer1,
            defaults={
                'description': 'I noticed an extra line item on my recent subscription invoice. Please clarify.',
                'priority': 'medium',
                'status': 'in_progress',
                'assigned_to': agent1,
            }
        )

        t3, _ = Ticket.objects.get_or_create(
            subject='Production API 500 error on checkout',
            user=customer2,
            defaults={
                'description': 'Our checkout webhook is failing with 500 internal server error during payment callback.',
                'priority': 'urgent',
                'status': 'open',
                'assigned_to': agent2,
            }
        )

        # 5. Sample Comments
        TicketComment.objects.get_or_create(
            ticket=t2,
            user=customer1,
            comment='I have attached the invoice reference #INV-9821 for your review.'
        )
        TicketComment.objects.get_or_create(
            ticket=t2,
            user=agent1,
            comment='Thank you John, we are investigating the billing credit adjustment now.'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with demo accounts & tickets!'))
