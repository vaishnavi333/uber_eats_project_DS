// Import axios for making HTTP requests
import axios from 'axios';

// Define the base URL for the API, using an environment variable or defaulting to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_URL, // Set the base URL for all requests
});

// Add a request interceptor to include the authorization token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (token) {
      // If token exists, set the Authorization header
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => Promise.reject(error) // Handle errors in request configuration
);

// Define API endpoint paths for various operations
export const endpoints = {
  customerLogin: '/customers/login/', // Endpoint for customer login
  restaurantSignup: '/restaurants/signup/', // Endpoint for restaurant signup
  restaurantLogin: '/restaurants/login/', // Endpoint for restaurant login
  customerSignup: '/customers/signup/', // Endpoint for customer signup
  customerProfile: '/customers/profile/', // Endpoint for fetching customer profile
  updateProfile: '/customers/update_profile/', // Endpoint for updating customer profile
  restaurants: '/restaurants/', // Endpoint for fetching restaurant list
  addDish: '/dishes/createDish', // Endpoint for adding a new dish
  editDish: '/dishes/editDish', // Endpoint for editing an existing dish
  getDish: '/dishes/getDish', // Endpoint for retrieving a specific dish
  orders: '/orders/', // Endpoint for fetching customer orders
  orderDetail: '/orders/getOrderDetail', // Endpoint for fetching details of a specific order
  customerDetail: '/customers/details', // Endpoint for fetching customer details
  order_details: '/cart-items/order_details/', // Endpoint for fetching order details in cart
  placeOrder: '/orders/place_order/', // Endpoint for placing an order
  cartItems: '/cart-items/', // Endpoint for fetching cart items
  addToCart: '/cart-items/add_to_cart/', // Endpoint for adding items to cart
  favoriteRestaurants: '/favorite-restaurants/', // Endpoint for fetching favorite restaurants
  toggleFavorite: '/favorite-restaurants/toggle_favorite/', // Endpoint for toggling favorite status
  deliveryAddresses: '/delivery-addresses/', // Endpoint for fetching delivery addresses
};

// Function to handle profile updates using PATCH method
export const updateProfile = (data) => {
  return api.patch(endpoints.updateProfile, data, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set content type for multipart form data
    },
  });
};

// Export the configured axios instance for use in other parts of the application
export default api;
