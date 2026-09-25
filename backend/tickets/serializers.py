from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Ticket, TicketComment


class TicketCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )

    class Meta:
        model = TicketComment
        fields = ['id', 'ticket', 'user', 'user_id', 'comment', 'created_at']
        read_only_fields = ['id', 'ticket', 'user', 'created_at']


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='agent', is_active=True),
        source='assigned_to',
        write_only=True,
        required=False,
        allow_null=True
    )
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'user',
            'subject',
            'description',
            'priority',
            'status',
            'assigned_to',
            'assigned_to_id',
            'created_at',
            'updated_at',
            'comments_count',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'comments_count']


class TicketDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='agent', is_active=True),
        source='assigned_to',
        write_only=True,
        required=False,
        allow_null=True
    )
    comments = TicketCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'user',
            'subject',
            'description',
            'priority',
            'status',
            'assigned_to',
            'assigned_to_id',
            'created_at',
            'updated_at',
            'comments',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'comments']


class TicketCreateSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(max_length=255)
    description = serializers.CharField()
    priority = serializers.ChoiceField(
        choices=Ticket.PRIORITY_CHOICES,
        default='medium'
    )

    class Meta:
        model = Ticket
        fields = ['id', 'subject', 'description', 'priority']

    def validate_subject(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError('Subject cannot be empty.')
        if len(cleaned) < 4:
            raise serializers.ValidationError('Subject must be at least 4 characters long.')
        return cleaned

    def validate_description(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError('Description cannot be empty.')
        return cleaned


class TicketUpdateSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='agent', is_active=True),
        source='assigned_to',
        required=False,
        allow_null=True
    )

    class Meta:
        model = Ticket
        fields = ['subject', 'description', 'priority', 'status', 'assigned_to_id']
        extra_kwargs = {
            'subject': {'required': False},
            'description': {'required': False},
            'priority': {'required': False},
            'status': {'required': False},
        }
