import React, { useContext } from 'react'; 
import { Navbar, Nav, Container } from 'react-bootstrap'; 
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; 

function Header() { 
  const { user, logout } = useContext(AuthContext); // Get user and logout function from AuthContext
  const { cartItems } = useCart() || {}; // Get cartItems from CartContext; default to an empty object if undefined
  const navigate = useNavigate(); // Initialize navigation function
  // Calculate the total count of items in the cart
  const cartCount = Array.from(cartItems.values()).reduce((total, rest_cart) => total + rest_cart.length, 0);
  
  // Logout handler that also redirects to home
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/'); // Navigate to the home page after logout
  };

  return (
    <Navbar className="custom-navbar" expand="lg"> {/* Render the custom Navbar */}
      <Container>
        <Navbar.Brand as={Link} to="/user/home" className="navbar-brand">Uber Eats</Navbar.Brand> {/* Brand link to user home */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Toggle button for mobile view */}
        <Navbar.Collapse id="basic-navbar-nav"> {/* Collapsible menu for navigation links */}
          <Nav className="ml-auto" style={{ flexGrow: 1 }}> {/* Navigation links */}
            {user ? ( // Check if user is logged in
              <>
                <Nav.Link as={Link} to="/userprofile" className="nav-link">Welcome, {user.user.username}</Nav.Link> {/* Display username */}
                <Nav.Link as={Link} to="/restaurants" className="nav-link">Restaurants</Nav.Link> {/* Link to restaurants page */}
                <Nav.Link as={Link} to="/favorites" className="nav-link">Favorites</Nav.Link> {/* Link to favorites page */}
                <Nav.Link as={Link} to="/order-history" className="nav-link">Order History</Nav.Link> {/* Link to order history */}
                <Nav.Link onClick={handleLogout} className="nav-link">Logout</Nav.Link> {/* Logout link */}
              </>
            ) : ( // If user is not logged in
              <>
                <Nav.Link as={Link} to="/customer/login" className="nav-link">Login</Nav.Link> {/* Link to login page */}
                <Nav.Link as={Link} to="/signup" className="nav-link">Sign Up</Nav.Link> {/* Link to signup page */}
              </>
            )}
            <Nav.Link as={Link} to="/cart" aria-label="Cart" className="nav-link cart-icon"> {/* Link to cart */}
              <FontAwesomeIcon icon={faShoppingCart} /> {/* Display shopping cart icon */}
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Display item count if greater than 0 */}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header; // Export the Header component for use in other parts of the application
