from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from customers.views import CustomerViewSet, OrderViewSet, FavoriteRestaurantViewSet, CartItemViewSet, DeliveryAddressViewSet, me, CustomAuthToken
from restaurants.views import RestaurantViewSet, DishViewSet

# Create a router object to handle API routes
router = DefaultRouter()
router.register(r'customers', CustomerViewSet)  # Register CustomerViewSet for customer operations
router.register(r'orders', OrderViewSet, basename='order')  # Register OrderViewSet for order operations
router.register(r'favorite-restaurants', FavoriteRestaurantViewSet, basename='favorite-restaurant')  # Register FavoriteRestaurantViewSet for favorite restaurant operations
router.register(r'cart-items', CartItemViewSet, basename='cart-item')  # Register CartItemViewSet for cart item operations
router.register(r'restaurants', RestaurantViewSet)  # Register RestaurantViewSet for restaurant signup and management
router.register(r'dishes', DishViewSet)  # Register DishViewSet for dish operations
router.register(r'delivery-addresses', DeliveryAddressViewSet, basename='delivery-address')  # Register DeliveryAddressViewSet for delivery address operations

# Define URL patterns for the application
urlpatterns = [
    path('admin/', admin.site.urls),  # Admin site URL
    path('api/', include(router.urls)),  # Include the router's URLs under the 'api/' path
    path('api/restaurants/dashboard/', RestaurantViewSet.as_view({'get': 'dashboard'}), name='restaurant_dashboard'),  # URL for restaurant dashboard
    path('api/restaurants/<int:pk>/', RestaurantViewSet.as_view({'get': 'retrieve'}), name='restaurant-detail'),  # URL for retrieving a specific restaurant by ID
    path('api/restaurants/<int:pk>/orders/', RestaurantViewSet.as_view({'get': 'getOrders'}), name='restaurant-orders'),  # URL for getting orders for a specific restaurant
    path('api/restaurants/<int:pk>/dishes/', RestaurantViewSet.as_view({'get': 'list_dishes'}), name='restaurant-dishes'),  # URL for listing dishes of a specific restaurant
    path('api/customers/login/', CustomAuthToken.as_view(), name='api_token_auth'),  # URL for customer login via token authentication
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # Serve media files during development