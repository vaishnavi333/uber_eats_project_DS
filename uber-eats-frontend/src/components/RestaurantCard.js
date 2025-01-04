import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';  
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import './RestaurantCard.css'; 

const RestaurantCard = ({ restaurant, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate(); // Initialize the navigate function for routing

  // Function to handle menu viewing navigation
  const handleViewMenu = () => {
    navigate(`/restaurants/${restaurant.id}`); // Navigate to the restaurant's menu page
  };

  return (
    <Card className="restaurant-card"> {/* Card component to display restaurant details */}

      <CardMedia
        component="img" // Media component for displaying the restaurant image
        className="dish-image" // CSS class for image styling
        image={restaurant.image || 'https://modernrestaurantmanagement.com/assets/media/2021/03/Getty_629200476-1200x655.jpg'} // Fallback image if none is provided
        alt={restaurant.name} // Alternative text for accessibility
      />
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="restaurant-name">
          {restaurant.name} 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {restaurant.description} 
        </Typography>
        
        <div className="card-actions"> {/* Container for action buttons */}
          <Button variant="contained" color="primary" onClick={handleViewMenu}>
            View Menu {/* Button to view the restaurant's menu */}
          </Button>

          <IconButton onClick={() => toggleFavorite(restaurant.id)} aria-label="add to favorites"> {/* IconButton for toggling favorites */}
            {isFavorite ? <Favorite color="secondary" /> : <FavoriteBorder />} {/* Display filled or outline favorite icon based on state */}
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard; // Export the RestaurantCard component
