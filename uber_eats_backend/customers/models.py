# Importing necessary modules from Django
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from restaurants.models import Restaurant, Dish

# Defining the Customer model, extending Django's User model
class Customer(models.Model):
    # One-to-one relationship with Django's User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Fields for the customer profile
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    nickname = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    name = models.CharField(max_length=100, blank=True)
    email = models.CharField(max_length=100, blank=True)

    def __str__(self):
        # Returns the username of the associated User
        return self.user.username

# Signal to create a Customer instance when a User is created
@receiver(post_save, sender=User)
def create_customer(sender, instance, created, **kwargs):
    if created:
        Customer.objects.create(user=instance)

# Signal to save the associated Customer instance when a User is saved
@receiver(post_save, sender=User)
def save_customer(sender, instance, **kwargs):
    instance.customer.save()

# Defining the DeliveryAddress model for storing customer addresses
class DeliveryAddress(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    address_line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        # Returns a string representation of the address
        return f"{self.address_line1}, {self.city}, {self.state}"

# Defining the FavoriteRestaurant model for storing a customer's favorite restaurants
class FavoriteRestaurant(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

# Defining the Order model for storing customer orders
class Order(models.Model):
    # Choices for the order status
    STATUS_CHOICES = [
        ('new', 'New'),
        ('preparing', 'Preparing'),
        ('on_the_way', 'On the Way'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('pickup_ready', 'Pick up Ready'),
        ('picked_up', 'Picked Up'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_address = models.ForeignKey(DeliveryAddress, on_delete=models.SET_NULL, null=True)

# Defining the OrderItem model for items in an order
class OrderItem(models.Model):  
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        # Returns a string representation of the order item
        return f"{self.dish.name} (x{self.quantity})"

# Defining the CartItem model for items in a customer's cart
class CartItem(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=True) 
    # Choices for the cart item state
    STATE = [ ('placing', "Placing"), ('placed', 'Placed')]
    state = models.CharField(max_length=20, choices=STATE, default='placing')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        # Returns a string representation of the cart item
        return f"{self.dish.name} (x{self.quantity})"
