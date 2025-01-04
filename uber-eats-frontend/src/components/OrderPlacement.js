import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import { Form, Button, Alert, Card } from 'react-bootstrap'; 
import api, { endpoints } from '../services/api'; 
import './OrderPlacement.css'; 


// Define the OrderPlacement functional component
const OrderPlacement = () => {
  // State hooks for managing component state
  const [cartItems, setCartItems] = useState([]); // Store items in the cart
  const [restId, setRestId] = useState(null); // Store selected restaurant ID
  const [addresses, setAddresses] = useState([]); // Store delivery addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Store selected address ID
  const [newAddress, setNewAddress] = useState({ // State for new address form
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false); // Toggle for showing the new address form
  const [error, setError] = useState(''); // Store error messages
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get current location
  const [restaurantName, setRestaurantName] = useState(''); // Store the restaurant name

  // Fetch cart items and delivery addresses when the component mounts
  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, []);

  // Fetch cart items from location state
  const fetchCartItems = async() => {
    const cart_data = location.state; // Get cart data from location
    if (!cart_data) {
      navigate('/cart'); // Redirect to cart if no data is found
    }
    if (cart_data.rest_id && cart_data.rest_cart) {
      setCartItems(cart_data.rest_cart); // Set cart items state
      setRestId(cart_data.rest_id); // Set restaurant ID
      try {
        const response = await api.get(`${endpoints.restaurants}/${cart_data.rest_id}`.replace(/\/+/g, '/'));
        setRestaurantName(response.data.name); // Set restaurant name
      } catch (error) {
        console.error('Error fetching restaurant name:', error);
        setError('Failed to load restaurant name. Please try again.'); // Handle fetch error
      }
      console.log('Cart Items:', cart_data.rest_cart);
    } else {
      navigate('/cart'); // Redirect to cart if no restaurant ID or cart
    }
  };

  // Fetch delivery addresses from API
  const fetchAddresses = async () => {
    try {
      const response = await api.get(endpoints.deliveryAddresses);
      console.log('Fetched addresses:', response.data);
      setAddresses(response.data); // Set addresses state
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id); // Set default selected address
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load delivery addresses. Please try again.'); // Handle fetch error
    }
  };

  // Handle changes to the selected address
  const handleAddressChange = (e) => {
    setSelectedAddressId(parseInt(e.target.value)); // Update selected address ID
  };

  // Handle changes to the new address form fields
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value // Update new address state based on input
    }));
  };

  // Handle adding a new address
  const handleAddNewAddress = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log('Adding new address:', newAddress);
      const response = await api.post(endpoints.deliveryAddresses, newAddress); // Send new address to API
      console.log('New address added:', response.data);
      setAddresses([...addresses, response.data]); // Update addresses state with new address
      setSelectedAddressId(response.data.id); // Set new address as selected
      setShowNewAddressForm(false); // Hide new address form
      setNewAddress({ // Reset new address state
        address_line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false
      });
    } catch (error) {
      console.error('Error adding new address:', error);
      if (error.response) {
        setError(`Failed to add new address: ${JSON.stringify(error.response.data)}`); // Handle specific error messages
      } else {
        setError(`Failed to add new address: ${error.message}`); // Handle general error message
      }
    }
  };

  // Handle placing an order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address'); // Check if an address is selected
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        dish_id: item.dish.id, // Get dish ID from cart item
        quantity: item.quantity // Get quantity from cart item
      }));

      const orderData = {
        delivery_address_id: selectedAddressId, // Set delivery address ID
        restaurant_id: restId, // Set restaurant ID
        items: orderItems // Set order items
      };

      console.log('Placing Order Data:', orderData); 
      const response = await api.post(endpoints.placeOrder, orderData); // Place order via API
      console.log('Order placed:', response.data);
      alert('Order placed successfully!'); // Show success message
      navigate('/order-history'); // Redirect to order history page
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.'); // Handle error placing order
    }
  };

  // Group cart items by restaurant
  const groupedCartItems = cartItems.reduce((acc, item) => {
    const { restaurant_id } = item.dish; 
    if (!acc[restaurant_id]) {
      acc[restaurant_id] = { restaurantName: restaurantName, items: [] }; // Initialize group for restaurant
    }
    acc[restaurant_id].items.push(item); // Add item to restaurant group
    return acc;
  }, {});

  // Calculate total price of cart items
  const totalPrice = cartItems.reduce((total, item) => total + (item.dish.price * item.quantity), 0);

  return (
    <div className="order-placement-container">
      <h2 className="text-center mb-4">Order Placement</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message if exists */}
      <Card className="mb-4">
        <Card.Header as="h5">Cart Items</Card.Header>
        <Card.Body>
        {Object.entries(groupedCartItems).map(([restaurantId, restaurantGroup]) => (
            <div key={restaurantId} className="restaurant-group">
              <p className="restaurant-name">{restaurantGroup.restaurantName}</p>
              {restaurantGroup.items.map(item => (
                <div key={item.id} className="cart-item">
                  <p>{item.dish.name} - Quantity: {item.quantity}</p> {/* Display cart item details */}
                </div>
              ))}
            </div>
          ))}
          <h5 className="mt-3">Total Price: ${totalPrice.toFixed(2)}</h5> {/* Display total price */}
        </Card.Body>
      </Card>
      <Card className="mb-4">
        <Card.Header as="h5">Select Delivery Address</Card.Header>
        <Card.Body>
          {addresses.map(address => (
            <Form.Check
              key={address.id}
              type="radio"
              id={`address-${address.id}`}
              name="address"
              value={address.id}
              checked={selectedAddressId === address.id} // Check if this address is selected
              onChange={handleAddressChange} // Handle change for address selection
              label={`${address.address_line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`} // Display address details
            />
          ))}
          <Button variant="link" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
            {showNewAddressForm ? 'Cancel' : 'Add New Address'} 
          </Button>
          {showNewAddressForm && (
            <Form onSubmit={handleAddNewAddress} className="mt-3"> {/* Form for adding new address */}
              <Form.Group controlId="address_line1">
                <Form.Control
                  type="text"
                  name="address_line1"
                  value={newAddress.address_line1} // Controlled input for address line 1
                  onChange={handleNewAddressChange} // Handle change for address line 1
                  placeholder="Address Line 1"
                  required
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Control
                  type="text"
                  name="city"
                  value={newAddress.city} // Controlled input for city
                  onChange={handleNewAddressChange} // Handle change for city
                  placeholder="City"
                  required
                />
              </Form.Group>
              <Form.Group controlId="state">
                <Form.Control
                  type="text"
                  name="state"
                  value={newAddress.state} // Controlled input for state
                  onChange={handleNewAddressChange} // Handle change for state
                  placeholder="State"
                  required
                />
              </Form.Group>
              <Form.Group controlId="postal_code">
                <Form.Control
                  type="text"
                  name="postal_code"
                  value={newAddress.postal_code} // Controlled input for postal code
                  onChange={handleNewAddressChange} // Handle change for postal code
                  placeholder="Postal Code"
                  required
                />
              </Form.Group>
              <Form.Group controlId="country">
                <Form.Control
                  type="text"
                  name="country"
                  value={newAddress.country} // Controlled input for country
                  onChange={handleNewAddressChange} // Handle change for country
                  placeholder="Country"
                  required
                />
              </Form.Group>
              <Form.Group controlId="is_default">
                <Form.Check
                  type="checkbox"
                  name="is_default"
                  checked={newAddress.is_default} // Controlled input for default address
                  onChange={handleNewAddressChange} // Handle change for default address
                  label="Set as default address"
                />
              </Form.Group>
              <Button type="submit" variant="primary">Add Address</Button> {/* Submit button for adding address */}
            </Form>
          )}
        </Card.Body>
      </Card>
      <Button onClick={handlePlaceOrder} variant="success" className="mt-3">Place Order</Button> {/* Button for placing the order */}
    </div>
  );
};

export default OrderPlacement; // Export the component
