from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

from .models import Ticket, TicketComment
from .serializers import (
    TicketSerializer,
    TicketDetailSerializer,
    TicketCreateSerializer,
    TicketUpdateSerializer,
    TicketCommentSerializer,
)


class TicketListCreateView(APIView):
    """
    GET  /api/tickets — List tickets (filtered by user role, search, priority, status)
    POST /api/tickets — Create a new ticket (Customer/Agent)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = Ticket.objects.select_related('user', 'assigned_to').all()

        # Customers can only view their own tickets
        if user.role == 'customer':
            queryset = queryset.filter(user=user)

        # Filters for search, status, priority, assignment
        search = request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(subject__icontains=search) |
                Q(description__icontains=search) |
                Q(user__name__icontains=search) |
                Q(user__email__icontains=search)
            )

        status_param = request.query_params.get('status', '').strip()
        if status_param:
            queryset = queryset.filter(status=status_param)

        priority_param = request.query_params.get('priority', '').strip()
        if priority_param:
            queryset = queryset.filter(priority=priority_param)

        assigned_to_param = request.query_params.get('assigned_to', '').strip()
        if assigned_to_param:
            if assigned_to_param == 'unassigned':
                queryset = queryset.filter(assigned_to__isnull=True)
            elif assigned_to_param.isdigit():
                queryset = queryset.filter(assigned_to_id=int(assigned_to_param))

        # Sorting
        ordering = request.query_params.get('ordering', '-created_at').strip()
        valid_orderings = [
            'created_at', '-created_at',
            'updated_at', '-updated_at',
            'priority', '-priority',
            'status', '-status'
        ]
        if ordering in valid_orderings:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-created_at')

        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TicketCreateSerializer(data=request.data)
        if serializer.is_valid():
            ticket = serializer.save(user=request.user)
            return Response(
                TicketSerializer(ticket).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'message': 'Failed to create ticket.',
                'errors': serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class TicketDetailView(APIView):
    """
    GET    /api/tickets/:id — Retrieve ticket details & comments
    PUT    /api/tickets/:id — Update ticket status, priority, or assignment
    PATCH  /api/tickets/:id — Partial update
    DELETE /api/tickets/:id — Delete ticket
    """
    permission_classes = [IsAuthenticated]

    def get_ticket(self, pk, user):
        try:
            ticket = Ticket.objects.select_related('user', 'assigned_to').prefetch_related('comments__user').get(pk=pk)
        except Ticket.DoesNotExist:
            return None, Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Enforce Customer isolation
        if user.role == 'customer' and ticket.user_id != user.id:
            return None, Response({'error': 'You do not have permission to view this ticket.'}, status=status.HTTP_403_FORBIDDEN)

        return ticket, None

    def get(self, request, pk):
        ticket, err_response = self.get_ticket(pk, request.user)
        if err_response:
            return err_response

        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        ticket, err_response = self.get_ticket(pk, request.user)
        if err_response:
            return err_response

        # Customers cannot reassign tickets or update priority
        if request.user.role == 'customer':
            allowed_fields = {'status', 'description', 'subject'}
            for key in request.data.keys():
                if key not in allowed_fields:
                    return Response(
                        {'error': f"Customers are not permitted to update '{key}'."},
                        status=status.HTTP_403_FORBIDDEN
                    )

        serializer = TicketUpdateSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            updated_ticket = serializer.save()
            return Response(
                TicketSerializer(updated_ticket).data,
                status=status.HTTP_200_OK
            )
        return Response(
            {
                'message': 'Failed to update ticket.',
                'errors': serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        ticket, err_response = self.get_ticket(pk, request.user)
        if err_response:
            return err_response

        ticket.delete()
        return Response(
            {'message': f'Ticket #{pk} was deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )


class TicketCommentListCreateView(APIView):
    """
    GET  /api/tickets/:id/comments — Retrieve all comments for a ticket
    POST /api/tickets/:id/comments — Add a response/comment to a ticket
    """
    permission_classes = [IsAuthenticated]

    def get_ticket(self, ticket_id, user):
        try:
            ticket = Ticket.objects.get(pk=ticket_id)
        except Ticket.DoesNotExist:
            return None, Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.role == 'customer' and ticket.user_id != user.id:
            return None, Response({'error': 'You do not have permission to view or comment on this ticket.'}, status=status.HTTP_403_FORBIDDEN)

        return ticket, None

    def get(self, request, ticket_id):
        ticket, err_response = self.get_ticket(ticket_id, request.user)
        if err_response:
            return err_response

        comments = ticket.comments.select_related('user').order_by('created_at')
        serializer = TicketCommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, ticket_id):
        ticket, err_response = self.get_ticket(ticket_id, request.user)
        if err_response:
            return err_response

        comment_text = request.data.get('comment', '').strip()
        if not comment_text:
            return Response(
                {'errors': {'comment': ['Comment cannot be empty.']}},
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = TicketComment.objects.create(
            ticket=ticket,
            user=request.user,
            comment=comment_text
        )

        return Response(
            TicketCommentSerializer(comment).data,
            status=status.HTTP_201_CREATED
        )


class TicketStatsView(APIView):
    """
    GET /api/tickets/stats — Returns summary counts for Agent / Customer dashboard
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = Ticket.objects.all()

        if user.role == 'customer':
            queryset = queryset.filter(user=user)

        total = queryset.count()
        open_count = queryset.filter(status='open').count()
        in_progress_count = queryset.filter(status='in_progress').count()
        resolved_count = queryset.filter(status='resolved').count()
        closed_count = queryset.filter(status='closed').count()
        urgent_count = queryset.filter(priority='urgent').exclude(status__in=['resolved', 'closed']).count()
        unassigned_count = queryset.filter(assigned_to__isnull=True).exclude(status__in=['resolved', 'closed']).count()

        return Response({
            'total': total,
            'open': open_count,
            'in_progress': in_progress_count,
            'resolved': resolved_count,
            'closed': closed_count,
            'urgent': urgent_count,
            'unassigned': unassigned_count,
        }, status=status.HTTP_200_OK)
