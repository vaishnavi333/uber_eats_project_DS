import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import './RestaurantDashboard.css'; 

// Function component for the restaurant dashboard
function RestaurantDashboard() {
  const { id } = useParams(); // Retrieve the restaurant ID from the URL parameters
  const navigate = useNavigate(); // Hook for navigation

  // Navigate to the restaurant profile management page
  const handleProfileManagement = () => {
    navigate('/restaurant/profile'); // Redirect to profile management route
  };

  // Navigate to the orders management page for the specific restaurant
  const handleOrdersManagement = () => {
    navigate(`/restaurant/${id}/orders`); // Redirect to orders management route with restaurant ID
  };


  return (
    <Container className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="button-group">
        <Button variant="primary" onClick={handleProfileManagement} className="dashboard-button">
          Profile Management
        </Button>
        <Button variant="secondary" onClick={handleOrdersManagement} className="dashboard-button">
          Orders Management
        </Button>
      </div>
    </Container>
  );
}

export default RestaurantDashboard;
