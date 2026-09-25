import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User
from tickets.models import Ticket, TicketComment


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def customer_john(db):
    return User.objects.create_user(
        email='john@example.com',
        name='John Doe',
        password='Password@123',
        role='customer'
    )


@pytest.fixture
def customer_alice(db):
    return User.objects.create_user(
        email='alice@example.com',
        name='Alice Smith',
        password='Password@123',
        role='customer'
    )


@pytest.fixture
def agent_bob(db):
    return User.objects.create_user(
        email='bob@example.com',
        name='Bob Agent',
        password='Password@123',
        role='agent',
        is_staff=True
    )


@pytest.fixture
def john_ticket(db, customer_john):
    return Ticket.objects.create(
        user=customer_john,
        subject='Database connection failed',
        description='Cannot connect to port 3306',
        priority='high',
        status='open'
    )


@pytest.fixture
def alice_ticket(db, customer_alice):
    return Ticket.objects.create(
        user=customer_alice,
        subject='Payment gateway 500 error',
        description='Checkout webhook fails',
        priority='urgent',
        status='open'
    )


@pytest.mark.django_db
class TestTicketManagement:
    """
    Phase 2 Ticket Management & Data Isolation Tests
    """

    def test_customer_can_create_ticket(self, api_client, customer_john):
        api_client.force_authenticate(user=customer_john)
        url = reverse('ticket-list-create')
        payload = {
            'subject': 'Slow dashboard loading',
            'description': 'The page takes over 10 seconds to load.',
            'priority': 'medium'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['subject'] == 'Slow dashboard loading'
        assert response.data['priority'] == 'medium'
        assert response.data['status'] == 'open'
        assert response.data['user']['email'] == 'john@example.com'

    def test_create_ticket_validation_fails_on_empty(self, api_client, customer_john):
        api_client.force_authenticate(user=customer_john)
        url = reverse('ticket-list-create')
        response = api_client.post(url, {'subject': '', 'description': ''}, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'errors' in response.data

    def test_customer_only_sees_own_tickets(self, api_client, customer_john, john_ticket, alice_ticket):
        api_client.force_authenticate(user=customer_john)
        response = api_client.get(reverse('ticket-list-create'))

        assert response.status_code == status.HTTP_200_OK
        ticket_ids = [t['id'] for t in response.data]
        assert john_ticket.id in ticket_ids
        assert alice_ticket.id not in ticket_ids

    def test_customer_cannot_access_other_customer_ticket(self, api_client, customer_john, alice_ticket):
        api_client.force_authenticate(user=customer_john)
        url = reverse('ticket-detail', kwargs={'pk': alice_ticket.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_agent_can_see_all_tickets(self, api_client, agent_bob, john_ticket, alice_ticket):
        api_client.force_authenticate(user=agent_bob)
        response = api_client.get(reverse('ticket-list-create'))

        assert response.status_code == status.HTTP_200_OK
        ticket_ids = [t['id'] for t in response.data]
        assert john_ticket.id in ticket_ids
        assert alice_ticket.id in ticket_ids

    def test_agent_can_search_and_filter_tickets(self, api_client, agent_bob, john_ticket, alice_ticket):
        api_client.force_authenticate(user=agent_bob)

        # Search by keyword
        res = api_client.get(reverse('ticket-list-create') + '?search=Database')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data) == 1
        assert res.data[0]['id'] == john_ticket.id

        # Filter by priority
        res_priority = api_client.get(reverse('ticket-list-create') + '?priority=urgent')
        assert res_priority.status_code == status.HTTP_200_OK
        assert len(res_priority.data) == 1
        assert res_priority.data[0]['id'] == alice_ticket.id

    def test_agent_can_update_ticket_status_and_assign(self, api_client, agent_bob, john_ticket):
        api_client.force_authenticate(user=agent_bob)
        url = reverse('ticket-detail', kwargs={'pk': john_ticket.id})
        payload = {
            'status': 'in_progress',
            'priority': 'urgent',
            'assigned_to_id': agent_bob.id
        }
        response = api_client.put(url, payload, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'in_progress'
        assert response.data['priority'] == 'urgent'
        assert response.data['assigned_to']['id'] == agent_bob.id

    def test_add_and_get_comments(self, api_client, customer_john, agent_bob, john_ticket):
        # 1. Customer adds comment
        api_client.force_authenticate(user=customer_john)
        url = reverse('ticket-comments', kwargs={'ticket_id': john_ticket.id})
        res1 = api_client.post(url, {'comment': 'Attaching server log error output.'}, format='json')
        assert res1.status_code == status.HTTP_201_CREATED
        assert res1.data['comment'] == 'Attaching server log error output.'
        assert res1.data['user']['email'] == 'john@example.com'

        # 2. Agent responds with comment
        api_client.force_authenticate(user=agent_bob)
        res2 = api_client.post(url, {'comment': 'Thank you John, we found the firewall rule block.'}, format='json')
        assert res2.status_code == status.HTTP_201_CREATED
        assert res2.data['user']['email'] == 'bob@example.com'

        # 3. Retrieve all comments
        api_client.force_authenticate(user=customer_john)
        res3 = api_client.get(url)
        assert res3.status_code == status.HTTP_200_OK
        assert len(res3.data) == 2

    def test_ticket_stats_endpoint(self, api_client, agent_bob, john_ticket, alice_ticket):
        api_client.force_authenticate(user=agent_bob)
        res = api_client.get(reverse('ticket-stats'))

        assert res.status_code == status.HTTP_200_OK
        assert res.data['total'] >= 2
        assert res.data['open'] >= 2
        assert 'urgent' in res.data
        assert 'in_progress' in res.data
