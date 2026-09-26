from django.contrib import admin
from .models import Ticket, TicketComment

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'user', 'priority', 'status', 'assigned_to', 'created_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('subject', 'description', 'user__name', 'user__email')
    ordering = ('-created_at',)

@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'user', 'comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('comment', 'user__name', 'user__email')
    ordering = ('-created_at',)

