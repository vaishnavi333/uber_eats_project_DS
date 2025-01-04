import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CustomerLogin.css'; 


function Login() {
  // State to manage username and password input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to store error message if login fails
  const { login } = useContext(AuthContext); // Access the login function from AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error state before login attempt
    const success = await login(username, password); // Attempt to log in with username and password
    if (success) {
      navigate('/user/home'); // Navigate to user home page on successful login
    } else {
      setError('Invalid username or password'); // Set error message on failed login
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Customer Login</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error alert if there's an error */}
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username" // Placeholder for username input
          value={username} // Bind input value to username state
          onChange={(e) => setUsername(e.target.value)} // Update username state on input change
          required // Make this field required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password" // Placeholder for password input
          value={password} // Bind input value to password state
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
          required // Make this field required
        />
      </Form.Group>
      <Button variant="primary" type="submit"> {/* Button to submit the login form */}
        Login
      </Button>
    </Form>
  );
}

export default Login;
