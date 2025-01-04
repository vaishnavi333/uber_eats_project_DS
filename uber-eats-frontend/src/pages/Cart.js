import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ListGroup, Row, Col } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import './Cart.css'; 
import { useCart } from '../context/CartContext'; 

const Cart = () => {
  // Access cart items and functions from the CartContext
  const { cartItems, setCartItems, setCartCount } = useCart(); 
  const [defaultAddress, setDefaultAddress] = useState(null); // State to store the default delivery address
  const [restaurantNames, setRestaurantNames] = useState(new Map()); // State to store restaurant names mapped to their IDs

  // Fetch cart items and default address when the component mounts
  useEffect(() => {
    fetchCartItems();
    fetchDefaultAddress();
  }, []);

  // Update cart count whenever cartItems changes
  useEffect(() => {
    const totalCount = Array.from(cartItems.values()).reduce((total, rest_cart) => total + rest_cart.items.length, 0);
    setCartCount(totalCount); // Update cart count in context
    console.log('Updated cartCount:', totalCount);
  }, [cartItems, setCartCount]);
  
  // Function to fetch cart items from the API
  const fetchCartItems = async () => {
    try {
      const response = await api.get(endpoints.cartItems);
      console.log("Fetched Cart Items:", response.data);
  
      const groupedCarts = new Map(); // To group cart items by restaurant
      const namesMap = new Map(); // To store restaurant names

      // Grouping items by restaurant
      for (const item of response.data) {
        const rest_id = item.restaurant; // restaurant ID
        if (!groupedCarts.has(rest_id)) {
          // Initialize grouping for a new restaurant
          groupedCarts.set(rest_id, {
            restaurant: item.dish.restaurant,
            items: []
          });
  
          // Fetch the restaurant name if it hasn't been fetched yet
          if (!namesMap.has(rest_id)) {
            const restaurantUrl = `${endpoints.restaurants}/${rest_id}`.replace(/\/+/g, '/'); // Clean up double slashes
            console.log("Fetching restaurant name from:", restaurantUrl); // Log the URL to check it
  
            try {
              const restaurantResponse = await api.get(restaurantUrl); // Fetch restaurant details
              namesMap.set(rest_id, restaurantResponse.data.name); // Store the restaurant name
            } catch (error) {
              console.error(`Error fetching name for restaurant ${rest_id}:`, error);
            }
          }
        }
        groupedCarts.get(rest_id).items.push(item); // Add item to the corresponding restaurant group
      }
  
      setRestaurantNames(namesMap); // Update state with restaurant names
      setCartItems(groupedCarts); // Finalize cart items grouping in state
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  // Function to fetch the default delivery address
  const fetchDefaultAddress = async () => {
    try {
      const response = await api.get(endpoints.deliveryAddresses);
      if (response.data.length > 0) {
        setDefaultAddress(response.data[0]); // Set the first address as the default
      }
    } catch (error) {
      console.error('Error fetching default address:', error);
    }
  };

  // Function to update item quantity in the cart
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await api.patch(`${endpoints.cartItems}${itemId}/`, { quantity: newQuantity }); // Update item quantity
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  // Function to remove an item from the cart
  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`${endpoints.cartItems}${itemId}/`); // Delete item from cart
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Function to calculate the total price of items in the cart
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.dish.price) * item.quantity, 0).toFixed(2); // Calculate total price
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {Array.from(cartItems).length === 0 ? ( // Check if cart is empty
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {Array.from(cartItems).map(([rest_id, rest_cart]) => ( // Iterate through grouped cart items
              <div key={rest_id}>
                <h6 className="restaurant-name">{restaurantNames.get(rest_id) || `Restaurant: ${rest_id}`}</h6> {/* Display restaurant name */}
                <ListGroup className="cart-list">
                  {rest_cart.items.map((item) => ( // Display each item in the cart
                    <ListGroup.Item key={item.id} className="cart-item">
                      <Row>
                        <Col xs={6}>
                          <h5 className="dish-name">{item.dish.name}</h5>
                          <p className="dish-price">Price: ${item.dish.price}</p>
                        </Col>
                        <Col xs={3} className="quantity-controls">
                          <Button variant="outline-secondary" size="sm" className="quantity-btn" 
                                  onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button> {/* Decrease quantity */}
                          <span className="quantity">{item.quantity}</span>
                          <Button variant="outline-secondary" size="sm" className="quantity-btn" 
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button> {/* Increase quantity */}
                        </Col>
                        <Col xs={3} className="remove-controls">
                          <Button variant="danger" size="sm" className="remove-btn" onClick={() => handleRemoveItem(item.id)}>Remove</Button> {/* Remove item from cart */}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Card className="mt-3">
                  <Card.Body>
                    <h3>Total: ${calculateTotal(rest_cart.items)}</h3> {/* Display total price for the restaurant's items */}
                    {defaultAddress && (
                      <div>
                        <h4>Default Delivery Address:</h4>
                        <p>{defaultAddress.address_line1}, {defaultAddress.city}, {defaultAddress.state}</p> {/* Display default address */}
                      </div>
                    )}
                    <div className="checkout-container">
                      <Link to="/order-placement" state={{ rest_id, rest_cart: rest_cart.items }}> {/* Link to proceed to checkout */}
                        <Button className="checkout-button">Proceed to Checkout</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default Cart; 
