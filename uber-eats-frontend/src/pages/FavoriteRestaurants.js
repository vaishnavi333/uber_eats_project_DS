import React, { useEffect, useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './FavoriteRestaurants.css';

// Define the FavoriteRestaurants functional component
function FavoriteRestaurants() {
    // State variables to hold the list of restaurants, user's favorites, loading state, and any error messages
    const [restaurants, setRestaurants] = useState([]); // Holds all restaurants data
    const [favorites, setFavorites] = useState([]); // Holds user's favorite restaurants data
    const [loading, setLoading] = useState(true); // Indicates loading status
    const [error, setError] = useState(''); // Holds any error messages

    // Effect hook to fetch favorite restaurants and restaurant data when the component mounts
    useEffect(() => {
        fetchFavRestaurants(); // Fetch all restaurants
        fetchFavorites(); // Fetch user's favorite restaurants
    }, []); // Empty dependency array ensures this runs only once on mount

    // Asynchronous function to fetch the list of all restaurants
    const fetchFavRestaurants = async () => {
        try {
            // API call to get favorite restaurants
            const response = await api.get(endpoints.favoriteRestaurants);
            setRestaurants(response.data); // Update state with the fetched data
        } catch (err) {
            // Set error message if the API call fails
            setError('Failed to fetch restaurants. Please try again later.');
        } finally {
            // Update loading state to false after data fetching completes
            setLoading(false);
        }
    };

    // Asynchronous function to fetch the user's favorite restaurants
    const fetchFavorites = async () => {
        try {
            // API call to get user's favorite restaurants
            const response = await api.get(endpoints.favoriteRestaurants);
            setFavorites(response.data); // Update state with the fetched favorites data
        } catch (err) {
            // Log error message if the API call fails
            console.error('Failed to fetch favorite restaurants.', err);
        }
    };

    // Function to toggle a restaurant's favorite status
    const toggleFavorite = async (restaurantId) => {
        try {
            // API call to toggle the favorite status of a restaurant
            await api.post(endpoints.toggleFavorite, { restaurant_id: restaurantId });
            fetchFavorites(); // Refresh the favorites list after toggling
        } catch (error) {
            // Log error message if toggling fails
            console.error('Error toggling favorite:', error);
        }
    };

    // Function to check if a restaurant is in the user's favorites list
    const isFavorite = (restaurantId) => {
        // Check if the restaurant ID exists in the favorites array
        return favorites.some(fav => fav.restaurant.id === restaurantId);
    };

    // Render loading spinner while data is being fetched
    if (loading) return <LoadingSpinner />;
    // Render error alert if an error occurred while fetching data
    if (error) return <Alert variant="danger">{error}</Alert>;

    // Render the component's UI
    return (
        <div className="favorite-restaurants-container">
            <h2>Your Favorite Restaurants</h2>
            <Row>
                {/* Map over the list of favorite restaurants to display them */}
                {favorites.flatMap(fav => fav.restaurant).map(restaurant => (
                    <Col key={restaurant.id} md={4} className="mb-4">
                        {/* Render RestaurantCard component for each favorite restaurant */}
                        <RestaurantCard 
                            restaurant={restaurant} // Pass restaurant data to the card
                            isFavorite={isFavorite(restaurant.id)} // Pass favorite status of the restaurant
                            toggleFavorite={toggleFavorite} // Pass toggle function for favorite status
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

// Export the FavoriteRestaurants component for use in other parts of the application
export default FavoriteRestaurants;
