from django.urls import path
from .views import (
    TicketListCreateView,
    TicketDetailView,
    TicketCommentListCreateView,
    TicketStatsView,
)

urlpatterns = [
    path('tickets/stats', TicketStatsView.as_view(), name='ticket-stats'),
    path('tickets', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/comments', TicketCommentListCreateView.as_view(), name='ticket-comments'),
]
