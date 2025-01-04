import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Signup.css';
import { AuthContext } from '../context/AuthContext';

// Functional component for restaurant signup
function RestaurantSignup() {
  // State to hold form data for the signup
  const [formData, setFormData] = useState({
    username: '', // Username input
    email: '', // Email input
    password: '', // Password input
    confirmPassword: '', // Confirm password input
    restaurantName: '', // Restaurant name input
    address: '', // Restaurant address input
    phone_number: '', // Restaurant phone number input
  });
  
  // Access loginRestaurant function from AuthContext
  const { loginRestaurant } = useContext(AuthContext);

  const [error, setError] = useState(''); // State to hold any error messages
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle changes in input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update formData state with input values
  };

  // Async function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous error messages
    setLoading(true); // Set loading state to true
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); // Set error message if passwords do not match
      setLoading(false); // Reset loading state
      return; // Exit the function
    }
    
    try {
      // Send a POST request to the signup endpoint with form data
      await api.post('/restaurants/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        restaurant_name: formData.restaurantName,
        address: formData.address,
        phone_number: formData.phone_number
      });
      alert("Restaurant Signup Successful!"); // Alert user of successful signup
      
      // Log in the restaurant and get its ID
      const restId = await loginRestaurant(formData.username, formData.password);
      navigate(`/restaurant/${restId}/dashboard`); // Redirect to the restaurant dashboard
    } catch (err) {
      // Extract error message from response or set a default message
      const error = err.response?.data?.error || 'Failed to sign up';
      setError('Failed to sign up: ' + error); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-form">
        <h2 className="text-center mb-4">Restaurant Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicRestaurantName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              name="restaurantName"
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Enter restaurant address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phone_number"
              placeholder="Enter restaurant phone number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RestaurantSignup;