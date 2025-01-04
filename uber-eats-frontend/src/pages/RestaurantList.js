import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Carousel } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ad1 from '../assets/images/ad1.png';
import ad2 from '../assets/images/ad2.png';
import ad3 from '../assets/images/ad3.png';
import './RestaurantList.css'; 

// Function component for displaying a list of restaurants
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]); // State to hold the list of restaurants
  const [favorites, setFavorites] = useState([]); // State to hold the user's favorite restaurants
  const [loading, setLoading] = useState(true); // State to indicate loading status
  const [error, setError] = useState(''); // State to hold any error messages

  // Effect to fetch restaurants and favorite restaurants on component mount
  useEffect(() => {
    fetchRestaurants(); // Fetch the list of restaurants
    fetchFavorites(); // Fetch the user's favorite restaurants
  }, []);

  // Function to fetch the list of restaurants from the API
  const fetchRestaurants = async () => {
    try {
      const response = await api.get(endpoints.restaurants); // API call to get restaurants
      console.log(response.data) // Log the fetched data
      setRestaurants(response.data); // Set the fetched restaurants in state
    } catch (err) {
      setError('Failed to fetch restaurants. Please try again later.'); // Set error message if API call fails
    } finally {
      setLoading(false); // Update loading status to false once API call is complete
    }
  };

  // Function to fetch the user's favorite restaurants from the API
  const fetchFavorites = async () => {
    try {
      const response = await api.get(endpoints.favoriteRestaurants); // API call to get favorite restaurants
      setFavorites(response.data); // Set the fetched favorites in state
    } catch (err) {
      console.error('Failed to fetch favorite restaurants.', err); // Log error if API call fails
    }
  };

  // Function to toggle a restaurant as favorite or not
  const toggleFavorite = async (restaurantId) => {
    try {
      await api.post(endpoints.toggleFavorite, { restaurant_id: restaurantId }); // API call to toggle favorite status
      fetchFavorites(); // Refresh the list of favorites
    } catch (error) {
      console.error('Error toggling favorite:', error); // Log error if API call fails
    }
  };

  // Function to check if a restaurant is in the user's favorites
  const isFavorite = (restaurantId) => {
    return favorites.some(fav => fav.restaurant.id === restaurantId); // Check if the restaurant ID is in favorites
  };

  if (loading) return <LoadingSpinner />; // Show loading spinner while fetching data
  if (error) return <Alert variant="danger">{error}</Alert>; // Show error alert if there's an error

  return (
    <div className="restaurant-list">
      <Carousel className="ad-carousel">
        <Carousel.Item>
          <img className="d-block w-100" src={ad1} alt="First slide" />
          <Carousel.Caption>
            <h3>Welcome to Uber Eats</h3>
            <p>Delicious meals delivered to your door.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={ad2} alt="Second slide" />
          <Carousel.Caption>
            <h3>Special Offers</h3>
            <p>Check out our exclusive offers!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={ad3} alt="Third slide" />
          <Carousel.Caption>
            <h3>New Restaurants</h3>
            <p>Discover new flavors today!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <h2 className="restaurants-title">Available Restaurants</h2>
      <Row>
        {restaurants.map(restaurant => (
          <Col key={restaurant.id} md={4} className="mb-4">
            <RestaurantCard 
              restaurant={restaurant} 
              isFavorite={isFavorite(restaurant.id)}  
              toggleFavorite={toggleFavorite}  
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RestaurantList;
