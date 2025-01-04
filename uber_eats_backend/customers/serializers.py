# Importing necessary modules from Django REST Framework
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Order, FavoriteRestaurant, CartItem, DeliveryAddress, OrderItem
from restaurants.serializers import RestaurantSerializer, DishSerializer
from .models import Restaurant, Dish

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Specifying fields to be included in the serialized representation
        fields = ['id', 'username', 'email', 'password']
        # Making the password write-only for security reasons
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Creating a new user instance with the validated data
        return User.objects.create_user(**validated_data)

# Serializer for the Customer model
class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for User

    class Meta:
        model = Customer
        fields = '__all__'  # Include all fields from the Customer model

    def create(self, validated_data):
        # Creating a new customer instance along with the associated user
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        # Updating the customer instance and the associated user if provided
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
        return super().update(instance, validated_data)

# Serializer for the FavoriteRestaurant model
class FavoriteRestaurantSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)  # Nested read-only restaurant serializer

    class Meta:
        model = FavoriteRestaurant
        fields = '__all__'  # Include all fields from the FavoriteRestaurant model

# Serializer for the DeliveryAddress model
class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        fields = ['id', 'address_line1', 'city', 'state', 'postal_code', 'country', 'is_default']
        read_only_fields = ['id']  # ID is read-only

# Serializer for the OrderItem model
class OrderItemSerializer(serializers.ModelSerializer):
    dish = DishSerializer(read_only=True)  # Nested read-only dish serializer

    class Meta:
        model = OrderItem
        fields = ['id', 'dish', 'quantity']  # Fields to include in the serialized representation

# Serializer for the Order model
class OrderSerializer(serializers.ModelSerializer):
    delivery_address = DeliveryAddressSerializer(read_only=True)  # Nested read-only delivery address serializer
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)  # Total price field
    customer = CustomerSerializer(read_only=True)  # Nested read-only customer serializer
    restaurant = RestaurantSerializer(read_only=True)  # Nested read-only restaurant serializer
    items = OrderItemSerializer(many=True, read_only=True)  # Nested read-only order items

    class Meta:
        model = Order
        fields = '__all__'  # Include all fields from the Order model

# Serializer for the CartItem model
class CartItemSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)  # Nested read-only customer serializer
    dish = DishSerializer(read_only=True)  # Nested read-only dish serializer
    order = OrderSerializer(read_only=True)  # Nested read-only order serializer

    class Meta:
        model = CartItem
        fields = ['id', 'dish', 'quantity', 'restaurant', 'customer', 'order']  # Fields to include

# Serializer for the Dish model
class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'image', 'is_vegetarian', 'is_vegan', 'is_gluten_free']  # Fields to include
