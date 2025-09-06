# ContactRequest API Views for Django
# Add this to your views.py file in your Django app

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging
from .models import ContactRequest

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ContactRequestAPIView(View):
    """
    API view to handle contact request submissions from the demo form
    """
    
    def post(self, request):
        """
        Handle POST requests to create new contact requests
        """
        try:
            # Parse JSON data
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['firstName', 'lastName', 'email', 'company', 'companySize', 'country']
            missing_fields = [field for field in required_fields if not data.get(field)]
            
            if missing_fields:
                return JsonResponse({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }, status=400)
            
            # Create ContactRequest instance
            contact_request = ContactRequest.objects.create(
                first_name=data['firstName'],
                last_name=data['lastName'],
                email=data['email'],
                company=data['company'],
                company_size=data['companySize'],
                country=data['country'],
                additional_info=data.get('additionalInfo', ''),
                source=data.get('source', 'demo-page'),
                status='new'
            )
            
            # Log the submission
            logger.info(f'New contact request submitted: {contact_request.full_name} from {contact_request.company}')
            
            return JsonResponse({
                'success': True,
                'message': 'Contact request submitted successfully',
                'id': contact_request.id
            }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON data'
            }, status=400)
            
        except Exception as e:
            logger.error(f'Error creating contact request: {str(e)}')
            return JsonResponse({
                'error': 'Internal server error'
            }, status=500)
    
    def get(self, request):
        """
        Handle GET requests to retrieve contact requests (for admin use)
        """
        try:
            # Get query parameters
            status = request.GET.get('status')
            limit = int(request.GET.get('limit', 50))
            offset = int(request.GET.get('offset', 0))
            
            # Build queryset
            queryset = ContactRequest.objects.all()
            
            if status:
                queryset = queryset.filter(status=status)
            
            # Apply pagination
            queryset = queryset[offset:offset + limit]
            
            # Serialize data
            contact_requests = []
            for cr in queryset:
                contact_requests.append({
                    'id': cr.id,
                    'firstName': cr.first_name,
                    'lastName': cr.last_name,
                    'email': cr.email,
                    'company': cr.company,
                    'companySize': cr.company_size,
                    'country': cr.country,
                    'additionalInfo': cr.additional_info,
                    'status': cr.status,
                    'timestamp': cr.timestamp.isoformat(),
                    'source': cr.source
                })
            
            return JsonResponse({
                'success': True,
                'data': contact_requests,
                'count': len(contact_requests)
            })
            
        except Exception as e:
            logger.error(f'Error retrieving contact requests: {str(e)}')
            return JsonResponse({
                'error': 'Internal server error'
            }, status=500)

# Alternative function-based view (if you prefer)
@csrf_exempt
@require_http_methods(["POST"])
def submit_contact_request(request):
    """
    Function-based view for contact request submission
    """
    try:
        data = json.loads(request.body)
        
        # Create contact request
        contact_request = ContactRequest.objects.create(
            first_name=data.get('firstName', ''),
            last_name=data.get('lastName', ''),
            email=data.get('email', ''),
            company=data.get('company', ''),
            company_size=data.get('companySize', ''),
            country=data.get('country', ''),
            additional_info=data.get('additionalInfo', ''),
            source=data.get('source', 'demo-page')
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Contact request submitted successfully',
            'id': contact_request.id
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
