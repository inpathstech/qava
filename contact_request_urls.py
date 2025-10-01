# URL Configuration for ContactRequest API
# Add this to your urls.py file in your Django app

from django.urls import path
from . import views

urlpatterns = [
    # API endpoint for contact request submissions
    path('admin/contact-requests/', views.ContactRequestAPIView.as_view(), name='contact-requests-api'),
    
    # Alternative function-based endpoint
    # path('admin/contact-requests/', views.submit_contact_request, name='contact-requests-submit'),
]

# If you're adding this to your main project urls.py, include it like this:
# urlpatterns = [
#     path('api/', include('your_app.urls')),
#     # ... other patterns
# ]
