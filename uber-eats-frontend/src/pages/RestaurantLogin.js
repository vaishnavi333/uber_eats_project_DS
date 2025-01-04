import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomerLogin.css';
import api, { endpoints } from '../services/api';  


// Function component for handling restaurant login
function RestaurantLogin() {
  const [username, setUsername] = useState(''); // State to hold the username input
  const [password, setPassword] = useState(''); // State to hold the password input
  const [error, setError] = useState(''); // State to hold error messages
  const { loginRestaurant } = useContext(AuthContext); // Access the loginRestaurant function from AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate to other routes

  // Function to handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Reset error message before login attempt
    const restaurant_id = await loginRestaurant(username, password); // Attempt to log in and get restaurant ID
    if (restaurant_id) {
      navigate(`/restaurant/${restaurant_id}/dashboard`); // Navigate to the restaurant dashboard if login is successful
    } else {
      setError('Invalid username or password'); // Set error message if login fails
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Restaurant Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}

export default RestaurantLogin;