# restaurants/management/commands/add_sample_dishes.py
from django.core.management.base import BaseCommand
from restaurants.models import Restaurant, Dish
from django.contrib.auth.models import User
import random

class Command(BaseCommand):
    help = 'Adds sample dishes to existing restaurants'

    def handle(self, *args, **options):
        restaurants = Restaurant.objects.all()

        if not restaurants.exists():
            self.stdout.write(self.style.ERROR('No restaurants found. Please add restaurants first.'))
            return

        dish_data = [
            {
                'name': 'Margherita Pizza',
                #'ingredients': 'Tomato sauce, mozzarella, basil',
                'price': 10.99,
                'description': 'Classic Italian pizza',
                #'category': 'main_course',
            },
            {
                'name': 'Caesar Salad',
                #'ingredients': 'Romaine lettuce, croutons, parmesan cheese, Caesar dressing',
                'price': 8.99,
                'description': 'Fresh and crispy salad',
                #'category': 'salad',
            },
            {
                'name': 'Chocolate Brownie',
                #'ingredients': 'Chocolate, flour, sugar, eggs',
                'price': 5.99,
                'description': 'Rich and fudgy dessert',
                #'category': 'dessert',
            },
        ]

        for restaurant in restaurants:
            for dish in dish_data:
                Dish.objects.create(
                    restaurant=restaurant,
                    **dish
                )
            self.stdout.write(self.style.SUCCESS(f'Added sample dishes to {restaurant.name}'))
