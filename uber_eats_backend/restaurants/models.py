from django.db import models  
from django.contrib.auth.models import User  

class Restaurant(models.Model):
    # One-to-one relationship with User model, allows each restaurant to be linked to a user
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    
    name = models.CharField(max_length=100)  # Name of the restaurant
    description = models.TextField()  # Description of the restaurant
    address = models.CharField(max_length=255, null=True, blank=True)  # Address of the restaurant (optional)
    phone_number = models.DecimalField(max_digits=12, decimal_places=0, default=0)  # Phone number of the restaurant
    image = models.ImageField(upload_to='restaurant_images/', null=True, blank=True)  # Image field for restaurant's picture
    opening_time = models.TimeField(null=True, blank=True)  # Opening time of the restaurant (optional)
    closing_time = models.TimeField(null=True, blank=True)  # Closing time of the restaurant (optional)

    def __str__(self):
        return self.name  # Return the restaurant name as its string representation


class Dish(models.Model):
    # Foreign key relationship with Restaurant model, allows each dish to be linked to a restaurant
    restaurant = models.ForeignKey(Restaurant, related_name='dishes', on_delete=models.CASCADE)
    
    name = models.CharField(max_length=100)  # Name of the dish
    ingredients = models.CharField(max_length=150, null=True)  # Ingredients used in the dish (optional)
    description = models.TextField()  # Description of the dish
    price = models.DecimalField(max_digits=6, decimal_places=2)  # Price of the dish
    image = models.ImageField(upload_to='dish_images/', null=True, blank=True)  # Image field for dish's picture
    
    # Define categories for dishes
    categories = [
        ('Appetizer', 'Appetizer'),
        ('Salad', 'Salad'),
        ('Main Course', 'Main Course'),
        ('Dessert', 'Dessert'),
        ('Beverage', 'Beverage'),
    ]
    category = models.CharField(max_length=20, choices=categories, default='')  # Category of the dish
    is_vegetarian = models.BooleanField(default=False)  # Flag to indicate if the dish is vegetarian
    is_vegan = models.BooleanField(default=False)  # Flag to indicate if the dish is vegan
    is_gluten_free = models.BooleanField(default=False)  # Flag to indicate if the dish is gluten-free

    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"  # Return a string representation of the dish with its restaurant name
