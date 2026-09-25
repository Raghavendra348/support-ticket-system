from django.core.management.base import BaseCommand
from accounts.models import User
from tickets.models import Ticket, TicketComment


class Command(BaseCommand):
    help = 'Seeds database with realistic customers, support agents, tickets, and comments for development.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing seed data if needed
        TicketComment.objects.all().delete()
        Ticket.objects.all().delete()
        User.objects.all().delete()

        # 1. Create Support Agents
        agent_bob = User.objects.create_user(
            email='agent@example.com',
            name='Bob Agent',
            password='Agent@123',
            role='agent',
            is_staff=True
        )

        agent_sarah = User.objects.create_user(
            email='sarah.agent@example.com',
            name='Sarah Jenkins',
            password='Agent@123',
            role='agent',
            is_staff=True
        )

        # 2. Create Customers
        customer_john = User.objects.create_user(
            email='customer@example.com',
            name='John Doe',
            password='Customer@123',
            role='customer'
        )

        customer_alice = User.objects.create_user(
            email='alice@example.com',
            name='Alice Smith',
            password='Alice@123',
            role='customer'
        )

        # 3. Create Sample Tickets for John Doe
        ticket1 = Ticket.objects.create(
            user=customer_john,
            subject='Cannot connect to MySQL database service',
            description='Getting connection refused error when attempting to connect to port 3306.',
            priority='high',
            status='open',
            assigned_to=None
        )

        ticket2 = Ticket.objects.create(
            user=customer_john,
            subject='Billing invoice inquiry for March',
            description='I noticed an extra line item on my recent subscription invoice. Please clarify.',
            priority='medium',
            status='in_progress',
            assigned_to=agent_bob
        )

        ticket3 = Ticket.objects.create(
            user=customer_john,
            subject='Password reset email delay',
            description='Took 15 minutes to receive the reset link yesterday.',
            priority='low',
            status='resolved',
            assigned_to=agent_sarah
        )

        # 4. Create Sample Tickets for Alice Smith
        ticket4 = Ticket.objects.create(
            user=customer_alice,
            subject='Production API 500 error on checkout',
            description='Our checkout webhook is failing with 500 internal server error during payment callback.',
            priority='urgent',
            status='open',
            assigned_to=agent_bob
        )

        ticket5 = Ticket.objects.create(
            user=customer_alice,
            subject='Requesting extra API rate limit',
            description='We are expecting higher traffic next week for a product launch.',
            priority='medium',
            status='closed',
            assigned_to=agent_sarah
        )

        # 5. Create Comments
        TicketComment.objects.create(
            ticket=ticket2,
            user=customer_john,
            comment='I have attached the invoice reference #INV-9821 for your review.'
        )

        TicketComment.objects.create(
            ticket=ticket2,
            user=agent_bob,
            comment='Thank you John, we are investigating the billing credit adjustment now.'
        )

        TicketComment.objects.create(
            ticket=ticket4,
            user=agent_bob,
            comment='Alice, we identified the transient gateway timeout and deployed a fix to production.'
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with users, tickets, and comments!'))
        self.stdout.write('Accounts created:')
        self.stdout.write('  - Customer: customer@example.com / Customer@123')
        self.stdout.write('  - Customer: alice@example.com / Alice@123')
        self.stdout.write('  - Support Agent: agent@example.com / Agent@123')
        self.stdout.write('  - Support Agent: sarah.agent@example.com / Agent@123')
