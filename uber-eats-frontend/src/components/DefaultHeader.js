import React, { useContext } from 'react'; 
import { Navbar, Nav, Container } from 'react-bootstrap'; 
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext';  
import { useNavigate } from 'react-router-dom'; 
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; 

function DefaultHeader() { 
  const { user, logout } = useContext(AuthContext); // Destructure user and logout from AuthContext
  const { cartItems } = useCart() || {}; // Get cartItems from context, defaulting to an empty object if undefined
  const navigate = useNavigate(); // Initialize navigate function for navigation

  return (
    <Navbar className="custom-navbar" expand="lg"> {/* Render the Navbar component with custom styles */}
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">Uber Eats</Navbar.Brand> {/* Brand link to home */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Toggle button for responsive navbar */}
        <Navbar.Collapse id="basic-navbar-nav"> {/* Collapse menu for mobile view */}
          <Nav.Link as={Link} to="/customer/login" className="nav-link">Login</Nav.Link> {/* Link to the login page */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DefaultHeader; // Export the DefaultHeader component for use in other parts of the application
