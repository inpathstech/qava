# ContactRequest Model for Django
# Add this to your models.py file in your Django app

from django.db import models
from django.utils import timezone

class ContactRequest(models.Model):
    """
    Model to store contact requests from the demo form at qava.ai/demo
    """
    
    # Form fields from demo.html
    first_name = models.CharField(max_length=100, verbose_name="First Name")
    last_name = models.CharField(max_length=100, verbose_name="Last Name")
    email = models.EmailField(verbose_name="Work Email")
    company = models.CharField(max_length=200, verbose_name="Company Name")
    
    # Company size choices
    COMPANY_SIZE_CHOICES = [
        ('startup', 'Startup'),
        ('smb', 'SMB'),
        ('mid-market', 'Mid-market'),
        ('enterprise', 'Enterprise'),
        ('non-profit', 'Non-profit'),
        ('other', 'Other'),
    ]
    company_size = models.CharField(
        max_length=20, 
        choices=COMPANY_SIZE_CHOICES,
        verbose_name="Company Size"
    )
    
    # Country choices
    COUNTRY_CHOICES = [
        ('united-states', 'United States'),
        ('canada', 'Canada'),
        ('united-kingdom', 'United Kingdom'),
        ('germany', 'Germany'),
        ('france', 'France'),
        ('australia', 'Australia'),
        ('japan', 'Japan'),
        ('new-zealand', 'New Zealand'),
        ('other', 'Other'),
    ]
    country = models.CharField(
        max_length=20,
        choices=COUNTRY_CHOICES,
        verbose_name="Country or Region"
    )
    
    # Optional additional info
    additional_info = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="Additional Information"
    )
    
    # Metadata
    timestamp = models.DateTimeField(
        default=timezone.now, 
        verbose_name="Submitted At"
    )
    source = models.CharField(
        max_length=50, 
        default='demo-page',
        verbose_name="Source"
    )
    
    # Status tracking
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('closed', 'Closed'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Status"
    )
    
    # Admin notes
    admin_notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Admin Notes"
    )
    
    class Meta:
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company} ({self.timestamp.strftime('%Y-%m-%d')})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def company_size_display(self):
        return dict(self.COMPANY_SIZE_CHOICES).get(self.company_size, self.company_size)
    
    @property
    def country_display(self):
        return dict(self.COUNTRY_CHOICES).get(self.country, self.country)
