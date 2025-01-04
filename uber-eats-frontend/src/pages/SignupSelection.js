import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';  // Import Bootstrap components
import './SignupSelection.css';  // Your custom CSS

const SignupSelection = () => {
  const navigate = useNavigate();  // Initialize navigate

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <h2>Hey! Are you new here?</h2>
      <Button
        className="signup-btn mt-3"
        onClick={() => navigate('/signup')}  // Navigate to User Signup
      >
        User Signup
      </Button>
      <Button
        className="signup-btn mt-3"
        onClick={() => navigate('/restaurant/signup')}  // Navigate to Restaurant Signup
      >
        Restaurant Signup
      </Button>
      <Button
        className="back-home-btn mt-3"
        onClick={() => navigate('/')}  // Navigate back to Home
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default SignupSelection;
