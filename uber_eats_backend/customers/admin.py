# Importing the admin module from Django's contrib package
from django.contrib import admin

# Importing models to be registered in the Django admin site
from .models import Customer, Order, FavoriteRestaurant, CartItem

# Registering the Customer model with the admin site
admin.site.register(Customer)

# Registering the Order model with the admin site
admin.site.register(Order)

# Registering the FavoriteRestaurant model with the admin site
admin.site.register(FavoriteRestaurant)

# Registering the CartItem model with the admin site
admin.site.register(CartItem)
