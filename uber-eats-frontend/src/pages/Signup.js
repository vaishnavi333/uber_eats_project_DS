import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Signup.css'; 
import { AuthContext } from '../context/AuthContext';


// Functional component for user signup
function Signup() {
  // Access the login function from AuthContext
  const { login } = useContext(AuthContext);

  // State to hold form data for signup
  const [formData, setFormData] = useState({
    username: '', // Username input
    email: '', // Email input
    password: '', // Password input
    confirmPassword: '', // Confirm password input
  });

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
      await api.post('/customers/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Log in the user and get success status
      const success = await login(formData.username, formData.password);

      alert("Signup Successful! Please update details in the next page."); // Alert user of successful signup
      navigate('/userprofile', { state: { email: formData.email } }); // Redirect to the user profile page with email as state
    } catch (err) {
      // Extract error message from response and set error state
      const error = err.response.data.error;
      setError('Failed to sign up as : ' + error); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-wrapper"> {/* New main container for styling */}
      <div className="signup-form"> {/* Form container with class for specific styling */}
        <h2 className="text-center mb-4">Sign Up</h2>
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
            <Form.Label>Email address</Form.Label>
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

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Signup;


