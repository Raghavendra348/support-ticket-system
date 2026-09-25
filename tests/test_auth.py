import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_customer(db):
    return User.objects.create_user(
        email='testcustomer@example.com',
        name='Test Customer',
        password='Password@123',
        role='customer'
    )


@pytest.fixture
def create_agent(db):
    return User.objects.create_user(
        email='testagent@example.com',
        name='Test Agent',
        password='Password@123',
        role='agent',
        is_staff=True
    )


@pytest.mark.django_db
class TestAuthentication:
    """
    Phase 1 Authentication & Authorization Unit/API Tests
    """

    def test_customer_registration_success(self, api_client):
        url = reverse('auth-register')
        payload = {
            'name': 'New Customer',
            'email': 'newcustomer@example.com',
            'password': 'SecurePassword@123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert response.data['user']['email'] == 'newcustomer@example.com'
        assert response.data['user']['role'] == 'customer'

        # Verify password is not plaintext in database
        user = User.objects.get(email='newcustomer@example.com')
        assert user.password != 'SecurePassword@123'
        assert user.check_password('SecurePassword@123')

    def test_customer_registration_duplicate_email_fails(self, api_client, create_customer):
        url = reverse('auth-register')
        payload = {
            'name': 'Duplicate User',
            'email': 'testcustomer@example.com',
            'password': 'Password@123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'errors' in response.data
        assert 'email' in response.data['errors']

    def test_customer_registration_short_password_fails(self, api_client):
        url = reverse('auth-register')
        payload = {
            'name': 'Short Pass User',
            'email': 'short@example.com',
            'password': '123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'errors' in response.data
        assert 'password' in response.data['errors']

    def test_customer_login_success(self, api_client, create_customer):
        url = reverse('auth-login')
        payload = {
            'email': 'testcustomer@example.com',
            'password': 'Password@123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert response.data['user']['role'] == 'customer'

    def test_agent_login_success(self, api_client, create_agent):
        url = reverse('auth-login')
        payload = {
            'email': 'testagent@example.com',
            'password': 'Password@123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data
        assert response.data['user']['role'] == 'agent'

    def test_login_with_invalid_password_fails(self, api_client, create_customer):
        url = reverse('auth-login')
        payload = {
            'email': 'testcustomer@example.com',
            'password': 'WrongPassword123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'errors' in response.data

    def test_login_with_nonexistent_email_fails(self, api_client):
        url = reverse('auth-login')
        payload = {
            'email': 'nonexistent@example.com',
            'password': 'Password@123'
        }
        response = api_client.post(url, payload, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_protected_profile_requires_jwt(self, api_client):
        url = reverse('auth-me')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_protected_profile_accessible_with_jwt(self, api_client, create_customer):
        # 1. Login to get token
        login_res = api_client.post(reverse('auth-login'), {
            'email': 'testcustomer@example.com',
            'password': 'Password@123'
        })
        token = login_res.data['tokens']['access']

        # 2. Access /api/auth/me with Bearer token
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = api_client.get(reverse('auth-me'))

        assert response.status_code == status.HTTP_200_OK
        assert response.data['user']['email'] == 'testcustomer@example.com'

    def test_agent_only_user_list_forbidden_for_customer(self, api_client, create_customer):
        # Customer token
        login_res = api_client.post(reverse('auth-login'), {
            'email': 'testcustomer@example.com',
            'password': 'Password@123'
        })
        token = login_res.data['tokens']['access']

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = api_client.get(reverse('user-list'))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_agent_only_user_list_allowed_for_agent(self, api_client, create_agent):
        # Agent token
        login_res = api_client.post(reverse('auth-login'), {
            'email': 'testagent@example.com',
            'password': 'Password@123'
        })
        token = login_res.data['tokens']['access']

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = api_client.get(reverse('user-list'))
        assert response.status_code == status.HTTP_200_OK
