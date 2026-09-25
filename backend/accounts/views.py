from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .permissions import IsAgent


class RegisterView(APIView):
    """
    Public API endpoint to register a new Customer.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            refresh['name'] = user.name
            refresh['role'] = user.role
            refresh['email'] = user.email

            return Response(
                {
                    'message': 'Customer registered successfully.',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'message': 'Registration failed.',
                'errors': serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """
    Public API endpoint for Customer and Agent login using JWT.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = serializer.validated_data['tokens']
            return Response(
                {
                    'message': 'Login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': tokens,
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'message': 'Authentication failed.',
                'errors': serializer.errors,
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


class UserProfileView(APIView):
    """
    Protected API endpoint to fetch currently authenticated user details.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(
            {
                'user': serializer.data
            },
            status=status.HTTP_200_OK
        )


class UserListView(generics.ListAPIView):
    """
    Protected API endpoint for Support Agents to view user list (e.g. agents for assignment).
    """
    permission_classes = [IsAgent]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.filter(is_active=True)
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset
