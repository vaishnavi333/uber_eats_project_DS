import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './Checkout.css';  

const Checkout = () => {
  // Access cart items, calculate total function, and clearCart function from the CartContext
  const { cartItems, calculateTotal, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState(''); // State to store the delivery address

  // Function to handle order placement
  const handlePlaceOrder = async () => {
    // Check if an address is provided
    if (!address) {
      alert('Please provide a delivery address.'); // Alert user if no address
      return;
    }

    // Prepare order data with restaurant ID and delivery address
    const orderData = {
      restaurant_id: cartItems[0]?.dish.restaurant.id,  // Assuming all items in cart are from the same restaurant
      delivery_address: address,
    };

    try {
      const token = localStorage.getItem('token');  // Retrieve authentication token from local storage
      const response = await axios.post('http://localhost:8000/api/orders/place_order/', orderData, {
          headers: {
              Authorization: `Token ${token}`,  // Add token to request headers if authentication is required
          },
      });
      alert('Order placed successfully!'); // Notify user of successful order placement
      clearCart();  // Clear the cart after successful order placement
    } catch (error) {
      console.error('Error placing order:', error); // Log any errors that occur
      alert('Failed to place order. Please try again.'); // Notify user of failure
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <ul className="cart-items-list">
        {cartItems.map((item) => ( // Iterate through cart items and display them
          <li key={item.id} className="cart-item">
            {item.dish.name} - Quantity: {item.quantity} {/* Display dish name and quantity */}
          </li>
        ))}
      </ul>
      <h3 className="total-amount">Total: ${calculateTotal().toFixed(2)}</h3> {/* Display total amount */}

      <input
        type="text"
        className="address-input"
        placeholder="Enter delivery address" // Placeholder for address input
        value={address} // Bind input value to state
        onChange={(e) => setAddress(e.target.value)} // Update state on input change
      />
      <button className="checkout-button" onClick={handlePlaceOrder}> {/* Button to confirm and place order */}
        Confirm and Place Order
      </button>
    </div>
  );
};

export default Checkout;
