from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from restaurants.models import Restaurant, Dish
from django.utils import timezone

class Command(BaseCommand):
    help = 'Adds sample restaurants and dishes to the database'

    def handle(self, *args, **options):
        restaurants_data = [
            {
                'name': 'Pizza Palace',
                'description': 'Best pizza in town',
                'location': '123 Main St',
                'contact_info': '555-1234',
                'opening_time': '11:00',
                'closing_time': '23:00',
                'dishes': [
                    {
                        'name': 'Margherita Pizza',
                        'description': 'Classic tomato and mozzarella pizza',
                        'price': 10.99,
                        'category': 'main_course',
                    },
                    {
                        'name': 'Pepperoni Pizza',
                        'description': 'Pizza with pepperoni and cheese',
                        'price': 12.99,
                        'category': 'main_course',
                    },
                ]
            },
            {
                'name': 'Burger Bonanza',
                'description': 'Juicy burgers and crispy fries',
                'location': '456 Oak Ave',
                'contact_info': '555-5678',
                'opening_time': '10:00',
                'closing_time': '22:00',
                'dishes': [
                    {
                        'name': 'Classic Burger',
                        'description': 'Beef patty with lettuce, tomato, and cheese',
                        'price': 8.99,
                        'category': 'main_course',
                    },
                    {
                        'name': 'Veggie Burger',
                        'description': 'Plant-based patty with avocado and sprouts',
                        'price': 9.99,
                        'category': 'main_course',
                    },
                ]
            },
        ]

        for restaurant_data in restaurants_data:
            dishes = restaurant_data.pop('dishes')
            user = User.objects.create_user(
                username=restaurant_data['name'].lower().replace(' ', '_'),
                email=f"{restaurant_data['name'].lower().replace(' ', '_')}@example.com",
                password='samplepassword'
            )
            restaurant = Restaurant.objects.create(
                user=user,
                **restaurant_data
            )
            for dish_data in dishes:
                Dish.objects.create(restaurant=restaurant, **dish_data)
            
            self.stdout.write(self.style.SUCCESS(f'Successfully added restaurant: {restaurant.name}'))