from django.db import migrations


def seed_tickets(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    Ticket = apps.get_model('tickets', 'Ticket')
    TicketComment = apps.get_model('tickets', 'TicketComment')

    try:
        customer1 = User.objects.get(email='customer@example.com')
        customer2 = User.objects.get(email='alice@example.com')
        agent1 = User.objects.get(email='agent@example.com')
        agent2 = User.objects.get(email='sarah.agent@example.com')
    except User.DoesNotExist:
        return

    # Sample Ticket 1
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

    # Sample Ticket 2
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

    # Sample Ticket 3
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

    # Sample Comments
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


def reverse_seed(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
        ('accounts', '0002_seed_demo_users'),
    ]

    operations = [
        migrations.RunPython(seed_tickets, reverse_seed),
    ]
