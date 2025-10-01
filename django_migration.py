# Django Migration for ContactRequest Model
# Run these commands in your Django project directory

# 1. Create the migration file
# python manage.py makemigrations your_app_name

# 2. Apply the migration
# python manage.py migrate

# 3. If you need to create a superuser (if you don't have one)
# python manage.py createsuperuser

# 4. Run the development server to test
# python manage.py runserver

# The migration will create a table with these fields:
# - id (auto-increment primary key)
# - first_name (CharField, max_length=100)
# - last_name (CharField, max_length=100)
# - email (EmailField)
# - company (CharField, max_length=200)
# - company_size (CharField, max_length=20)
# - country (CharField, max_length=20)
# - additional_info (TextField, nullable)
# - timestamp (DateTimeField, auto_now_add=True)
# - source (CharField, max_length=50, default='demo-page')
# - status (CharField, max_length=20, default='new')
# - admin_notes (TextField, nullable)
