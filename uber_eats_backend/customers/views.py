import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Customer, Order, FavoriteRestaurant, CartItem, DeliveryAddress, Dish ,Restaurant,OrderItem
from .serializers import CustomerSerializer, OrderSerializer, FavoriteRestaurantSerializer, CartItemSerializer, DeliveryAddressSerializer,OrderItemSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny

# Set up logging
logger = logging.getLogger(__name__)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
         # Validate the provided data and authenticate the user
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
         # Create or retrieve the authentication token for the user
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key, # Return the token
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        logger.info(f"Login attempt for user: {username}")
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            serializer = self.get_serializer(user.customer)
            logger.info(f"Login successful for user: {username}")
            return Response({
                'token': token.key,
                'user': serializer.data
            })
        else:
            logger.warning(f"Login failed for user: {username}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def signup(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, password=password, email=email)
            customer = Customer.objects.update_or_create(user=user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
            'token': token.key,
            'user_id': user.id,
        }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def profile(self, request):
        serializer = self.get_serializer(request.user.customer)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    @permission_classes([IsAuthenticated])
    def logout(self, request):
        request.auth.delete()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    
    #UserProfile
    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def profile(self, request):
        logger.info(f"Fetching profile for user: {request.user.username}")
        try:
            serializer = self.get_serializer(request.user.customer)
            logger.info(f"Profile fetched successfully for user: {request.user.username}")
            return Response({"customer": serializer.data, "email" : request.user.email})
        except Exception as e:
            logger.error(f"Error fetching profile for user {request.user.username}: {str(e)}")
            return Response({'error': 'Failed to fetch profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    ##Update Profile
    @action(detail=False, methods=['patch'], parser_classes=[MultiPartParser, FormParser])
    @permission_classes([IsAuthenticated])
    def update_profile(self, request):
        customer = request.user.customer
        logger.info(request.data)
        logger.info(customer)
        serializer = self.get_serializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny] 

    def get_queryset(self): 
        user = self.request.user
        if hasattr(user, 'customer'):
            return Order.objects.filter(customer=user.customer)
        elif hasattr(user, 'restaurant'):
            return Order.objects.filter(restaurant=user.restaurant)
        return Order.objects.none()

    @action(detail=False, methods=['post'], url_path='place_order')
    def place_order(self, request):
        customer = Customer.objects.get(user=request.user)
        restaurant_id = request.data.get('restaurant_id')
        cart_items = CartItem.objects.filter(customer=customer, restaurant_id=restaurant_id, state='placing')

        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(request.data)

        deliveryAddr = DeliveryAddress.objects.get(id=request.data.get('delivery_address_id'))


        total_price = sum(item.dish.price * item.quantity for item in cart_items)
        order = Order.objects.create(
            customer=customer,
            restaurant_id=restaurant_id,
            total_price=total_price,
            delivery_address=deliveryAddr
        )

        # Create OrderItem instances from CartItem
        order_items = []
        for item in cart_items:
            order_item = OrderItem(
                order=order,
                dish=item.dish,
                quantity=item.quantity
            )
            order_items.append(order_item)
        OrderItem.objects.bulk_create(order_items)  # Bulk insert for efficiency

        # Link Cart Items to Order and update state
        cart_items.update(order=order, state='placed')

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def getOrderDetail(self, request):
        order_id = request.GET.get('orderId')
        order = Order.objects.filter(id=order_id).first()
        if order:
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def updateOrderStatus(self, request):
        order_id = request.data.get('orderId')
        order = Order.objects.filter(id=order_id).first()
        status = request.data.get('status')
        if status in dict(Order.STATUS_CHOICES):
            order.status = status
            order.save()
            return Response({'status': 'Order status updated'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
   
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='order_history')
    def order_history(self, request):
            customer = request.user.customer
            orders = Order.objects.filter(customer=customer).prefetch_related('orderitem_set')
            
            order_history_data = []
            for order in orders:
                order_data = OrderSerializer(order).data
                order_items = OrderItem.objects.filter(order=order)
                order_data['items'] = OrderItemSerializer(order_items, many=True).data
                order_history_data.append(order_data)

            return Response(order_history_data, status=status.HTTP_200_OK)

class FavoriteRestaurantViewSet(viewsets.ModelViewSet):
    queryset = FavoriteRestaurant.objects.all()
    serializer_class = FavoriteRestaurantSerializer
    permission_classes = [AllowAny]  # Make sure the user is authenticated

    def get_queryset(self):
        return FavoriteRestaurant.objects.filter(customer=self.request.user.customer)

    @action(detail=False, methods=['post'])
    def toggle_favorite(self, request):
        customer = request.user.customer
        restaurant_id = request.data.get('restaurant_id')
        favorite, created = FavoriteRestaurant.objects.get_or_create(
            customer=customer,
            restaurant_id=restaurant_id
        )
        if not created:
            favorite.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})
      

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart_items = CartItem.objects.filter(customer=self.request.user.customer, state='placing')
        logger.info(f"Cart items: {cart_items.values()}")
        return cart_items
        
    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        customer = request.user.customer
        dish_id = request.data.get('dish_id')
        restaurant_id = request.data.get('restaurant_id')
        quantity = request.data.get('quantity', 1)

        try:
            dish = Dish.objects.get(id=dish_id)  # Fetch the dish
            restaurant = dish.restaurant
            
            # Check if the restaurant is associated with the dish
            if dish.restaurant.id != restaurant.id:
                return Response({'error': 'Restaurant ID does not match the dish.'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new cart item with the restaurant reference
            cart_item = CartItem.objects.create(
                customer=customer,
                dish=dish,
                quantity=quantity,
                restaurant=restaurant  # Include restaurant reference
            )

            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Dish.DoesNotExist:
            return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error adding to cart: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

#Order Details to view in order history
    @action(detail=False, methods=['get'])
    def order_details(self, request):
        order_id = request.data.get('order_id')
        logger.info(request.data)
        order_items = CartItem.objects.filter(order__id=order_id)
        for item in order_items:
            logger.info(f"CartItem: {item}, Restaurant: {item.restaurant}")  # Log restaurant info for each item
        serializer = self.get_serializer(order_items)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = CustomerSerializer(request.user.customer)
    return Response(serializer.data)


class DeliveryAddressViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeliveryAddress.objects.filter(customer=self.request.user.customer)

    def perform_create(self, serializer):
        logger.info(f"Creating new delivery address for user: {self.request.user.username}")
        serializer.save(customer=self.request.user.customer)

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data for new delivery address: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            logger.info(f"Successfully created new delivery address: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            logger.error(f"Failed to create delivery address. Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

