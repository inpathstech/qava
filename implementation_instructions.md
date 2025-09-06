# Contact Requests Module Implementation Guide

## Overview
This guide will help you safely integrate the Contact Requests module into your existing Django backend without breaking anything.

## Files Created
1. `contact_request_model.py` - Django model for storing contact requests
2. `contact_request_admin.py` - Admin interface configuration
3. `contact_request_views.py` - API views for handling form submissions
4. `contact_request_urls.py` - URL routing configuration
5. `django_migration.py` - Migration instructions

## Step-by-Step Implementation

### 1. Add the Model to Your Django App

**In your Django app's `models.py` file:**
- Copy the `ContactRequest` class from `contact_request_model.py`
- Add it to your existing models.py file

### 2. Register the Model in Admin

**In your Django app's `admin.py` file:**
- Copy the `ContactRequestAdmin` class from `contact_request_admin.py`
- Add the import: `from .models import ContactRequest`
- The `@admin.register(ContactRequest)` decorator will automatically register it

### 3. Add API Views

**In your Django app's `views.py` file:**
- Copy the `ContactRequestAPIView` class from `contact_request_views.py`
- Add the necessary imports at the top

### 4. Update URL Configuration

**In your Django app's `urls.py` file:**
- Copy the URL patterns from `contact_request_urls.py`
- Add the import: `from . import views`

**In your main project's `urls.py` file:**
- Make sure your app's URLs are included (they probably already are)

### 5. Run Database Migrations

```bash
# Navigate to your Django project directory
cd /path/to/your/django/project

# Create migration
python manage.py makemigrations your_app_name

# Apply migration
python manage.py migrate
```

### 6. Test the Implementation

1. **Start your Django server:**
   ```bash
   python manage.py runserver
   ```

2. **Test the API endpoint:**
   - Your demo form should now submit to: `https://api.qava.ai/admin/contact-requests/`
   - Test with a tool like Postman or curl

3. **Check the admin interface:**
   - Go to: `https://api.qava.ai/admin/`
   - You should see "Contact Requests" in the admin sidebar
   - Click on it to view submitted requests

## Safety Measures

### Before Implementation:
1. **Backup your database** (if you have important data)
2. **Test in a development environment first**
3. **Review the model fields** to ensure they match your needs

### During Implementation:
1. **Add one file at a time** and test after each addition
2. **Run migrations carefully** - Django will show you what changes will be made
3. **Check for any import errors** in your Django logs

### After Implementation:
1. **Test the demo form submission** from your live site
2. **Verify data appears in admin interface**
3. **Check that existing functionality still works**

## Troubleshooting

### Common Issues:

1. **Import Errors:**
   - Make sure all imports are correct
   - Check that your app is in `INSTALLED_APPS` in settings.py

2. **Migration Issues:**
   - If you get migration conflicts, you may need to resolve them manually
   - Always backup before running migrations

3. **Admin Interface Not Showing:**
   - Make sure you're logged in as a superuser
   - Check that the model is properly registered

4. **API Endpoint Not Working:**
   - Check your URL configuration
   - Verify CORS settings if needed
   - Check Django logs for errors

## Customization Options

### Model Customization:
- Add more fields if needed
- Modify choices for company_size or country
- Add validation rules

### Admin Customization:
- Modify the list display
- Add more filters
- Customize the detail view

### API Customization:
- Add authentication if needed
- Modify response format
- Add rate limiting

## Support

If you encounter any issues:
1. Check Django logs for error messages
2. Verify all imports and syntax
3. Test each component individually
4. Make sure your database is properly configured

The implementation is designed to be non-breaking and follows Django best practices.
