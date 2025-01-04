import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useParams } from 'react-router-dom';

function RestaurantHeader(id) { 
  const { user, logout } = useContext(AuthContext); // Access user and logout function from AuthContext
  const navigate = useNavigate(); // Initialize the navigate function for routing

  // Function to handle user logout
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Navigate to the home page after logout
  };

  const dashboardLink = `/restaurant/${id.id}/dashboard`; // Create the dashboard link based on restaurant ID

  return (
    <Navbar className="custom-navbar" expand="lg"> {/* Custom Navbar component with expandable options */}
      <Container>
        <Navbar.Brand as={Link} to={dashboardLink} className="navbar-brand">Uber Eats</Navbar.Brand> {/* Brand logo linking to dashboard */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Button to toggle navigation on smaller screens */}
        <Navbar.Collapse id="basic-navbar-nav"> {/* Collapse the navigation links */}
          <Nav className="ml-auto" style={{ flexGrow: 1 }}> {/* Navigation items aligned to the right */}
            {user ? ( // Check if user is logged in
              <>
                <Nav.Link as={Link} to={dashboardLink} className="nav-link">Dashboard</Nav.Link> {/* Link to Dashboard for logged-in users */}
                <Nav.Link onClick={handleLogout} className="nav-link">Logout</Nav.Link> {/* Logout button */}
              </>
            ) : ( // If user is not logged in
              <>
                <Nav.Link as={Link} to="/customer/login" className="nav-link">Login</Nav.Link> {/* Link to Login page */}
                <Nav.Link as={Link} to="/signup" className="nav-link">Sign Up</Nav.Link> {/* Link to Sign Up page */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default RestaurantHeader; // Export the RestaurantHeader component
