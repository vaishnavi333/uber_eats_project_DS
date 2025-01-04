from django.contrib import admin  # Import the admin module to manage Django admin interface
from .models import Restaurant, Dish  # Import the Restaurant and Dish models

# Register the Restaurant model with the admin site
admin.site.register(Restaurant)

# Register the Dish model with the admin site
admin.site.register(Dish)
