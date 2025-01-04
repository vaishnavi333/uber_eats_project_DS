import React from 'react';
import { useNavigate } from 'react-router-dom';  
import './HomePage.css'; 

const HomePage = () => {
  const navigate = useNavigate();  // Initialize navigate function

  return (
    <div className="homepage-wrapper">
      <div className="overlay">
        <div className="text-center homepage-content">
          <h1 className="display-3">Welcome to Uber Eats</h1>
          <p className="lead">Your favorite food delivered fast at your door.</p>
          
          {/* Explore Restaurants Button */}
          <button 
            className="homepage-btn" 
            onClick={() => navigate('/restaurants')}
          >
            Explore Restaurants
          </button>
          <button 
            className="homepage-btn"
            onClick={() => navigate('/restaurant/login')}  // Link to login page
          >
            Restaurant Login
          </button>

          {/* Already a User? Login Button */}
          <button 
            className="homepage-btn"
            onClick={() => navigate('/customer/login')}  // Link to login page
          >
            Customer Login
          </button>

                    {/* Sign Up Button to navigate to Signup Selection */}
                    <button 
            className="homepage-btn"
            onClick={() => navigate('/signup-selection')}  // Navigate to signup selection page
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
