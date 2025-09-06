# ContactRequest Admin Configuration for Django
# Add this to your admin.py file in your Django app

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import ContactRequest

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    """
    Admin configuration for ContactRequest model
    """
    
    # List display configuration
    list_display = [
        'full_name_display',
        'email',
        'company',
        'company_size_display',
        'country_display',
        'status_display',
        'timestamp_display',
        'actions_column'
    ]
    
    # List filters
    list_filter = [
        'status',
        'company_size',
        'country',
        'timestamp',
        'source'
    ]
    
    # Search fields
    search_fields = [
        'first_name',
        'last_name',
        'email',
        'company',
        'additional_info'
    ]
    
    # Read-only fields
    readonly_fields = [
        'timestamp',
        'source',
        'full_name_display',
        'company_size_display',
        'country_display'
    ]
    
    # Fieldsets for detail view
    fieldsets = (
        ('Contact Information', {
            'fields': (
                'full_name_display',
                'email',
                'company',
                'company_size_display',
                'country_display'
            )
        }),
        ('Request Details', {
            'fields': (
                'additional_info',
                'status',
                'admin_notes'
            )
        }),
        ('Metadata', {
            'fields': (
                'timestamp',
                'source'
            ),
            'classes': ('collapse',)
        })
    )
    
    # Custom methods for display
    def full_name_display(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name_display.short_description = "Full Name"
    full_name_display.admin_order_field = 'first_name'
    
    def company_size_display(self, obj):
        return obj.company_size_display
    company_size_display.short_description = "Company Size"
    company_size_display.admin_order_field = 'company_size'
    
    def country_display(self, obj):
        return obj.country_display
    country_display.short_description = "Country"
    country_display.admin_order_field = 'country'
    
    def status_display(self, obj):
        colors = {
            'new': '#28a745',
            'contacted': '#17a2b8',
            'in_progress': '#ffc107',
            'completed': '#6f42c1',
            'closed': '#6c757d'
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = "Status"
    status_display.admin_order_field = 'status'
    
    def timestamp_display(self, obj):
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')
    timestamp_display.short_description = "Submitted"
    timestamp_display.admin_order_field = 'timestamp'
    
    def actions_column(self, obj):
        return format_html(
            '<a href="{}" class="button">View</a>',
            reverse('admin:appname_contactrequest_change', args=[obj.pk])
        )
    actions_column.short_description = "Actions"
    
    # Bulk actions
    actions = ['mark_as_contacted', 'mark_as_in_progress', 'mark_as_completed']
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} contact requests marked as contacted.')
    mark_as_contacted.short_description = "Mark selected as contacted"
    
    def mark_as_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} contact requests marked as in progress.')
    mark_as_in_progress.short_description = "Mark selected as in progress"
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} contact requests marked as completed.')
    mark_as_completed.short_description = "Mark selected as completed"
    
    # Custom list template to add stats
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        # Add statistics
        total_requests = ContactRequest.objects.count()
        new_requests = ContactRequest.objects.filter(status='new').count()
        contacted_requests = ContactRequest.objects.filter(status='contacted').count()
        in_progress_requests = ContactRequest.objects.filter(status='in_progress').count()
        
        extra_context['stats'] = {
            'total': total_requests,
            'new': new_requests,
            'contacted': contacted_requests,
            'in_progress': in_progress_requests
        }
        
        return super().changelist_view(request, extra_context=extra_context)
