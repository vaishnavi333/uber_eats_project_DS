from rest_framework import serializers  
from django.contrib.auth.models import User 
from .models import Restaurant, Dish  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Specify the User model to serialize
        fields = ['id', 'username', 'email']  # Define fields to include in the serialized output


class RestaurantSerializer(serializers.ModelSerializer):
    # Define custom serializer fields for formatted opening and closing times
    opening_time = serializers.SerializerMethodField()
    closing_time = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant  # Specify the Restaurant model to serialize
        fields = '__all__'  # Include all fields in the serialized output
   
    def get_opening_time(self, obj):
        # Custom method to format the opening_time field
        if isinstance(obj.opening_time, str):
            return obj.opening_time  # Return as-is if it's a string
        return obj.opening_time.strftime('%I:%M %p') if obj.opening_time else None  # Format as 12-hour time if it's a TimeField

    def get_closing_time(self, obj):
        # Custom method to format the closing_time field
        if isinstance(obj.closing_time, str):
            return obj.closing_time  # Return as-is if it's a string
        return obj.closing_time.strftime('%I:%M %p') if obj.closing_time else None  # Format as 12-hour time if it's a TimeField


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish  # Specify the Dish model to serialize
        fields = '__all__'  # Include all fields in the serialized output
        extra_kwargs = {
            'image': {'required': False},  # Make the image field optional during serialization
        }
