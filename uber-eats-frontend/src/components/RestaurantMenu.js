import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api, { endpoints } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DishDetailsModal from '../components/DishDetailsModal';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null); // State to store the restaurant details
  const [menu, setMenu] = useState([]); // State to store the menu items
  const [selectedDish, setSelectedDish] = useState(null); // State to keep track of the currently selected dish for details
  const { id } = useParams(); // Get the restaurant ID from the URL parameters
  const { user } = useContext(AuthContext); // Access the user context to check login status
  const { addToCart } = useCart(); // Access the addToCart function from CartContext

  // useEffect to fetch restaurant and menu data when the component mounts or when the restaurant ID changes
  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [id]);

  // Function to fetch restaurant and menu data from the API
  const fetchRestaurantAndMenu = async () => {
    try {
      const restaurantResponse = await api.get(`/restaurants/${id}/`); // Fetch restaurant details
      setRestaurant(restaurantResponse.data); // Set restaurant details in state
      const menuResponse = await api.get(`/restaurants/${id}/dishes/`); // Fetch menu items
      setMenu(menuResponse.data); // Set menu items in state
    } catch (error) {
      console.error('Error fetching restaurant and menu:', error); // Log any errors to the console
    }
  };

  // Function to handle adding a dish to the cart
  const handleAddToCart = (dish) => {
    if (!user) {
      alert('Please log in to add items to your cart'); // Alert user if not logged in
      return; // Exit the function if user is not logged in
    }

    addToCart(dish); // Add the selected dish to the cart
    alert('Item added to cart successfully!'); // Alert user that the item was added to the cart
  };

  if (!restaurant) return <div>Loading...</div>; // Show loading message if restaurant details are not yet available

  return (
    <div className="restaurant-menu"> {/* Main container for the restaurant menu */}
      <div className="restaurant-details"> {/* Section for displaying restaurant details */}
        <h1>{restaurant.name}</h1> {/* Restaurant name */}
        <p>{restaurant.description}</p> {/* Restaurant description */}
        <p>Location: {restaurant.location}</p> {/* Restaurant location */}
        <p>Contact: {restaurant.contact_info}</p> {/* Restaurant contact info */}
        <p>Opening Hours: {restaurant.opening_time} - {restaurant.closing_time}</p> {/* Restaurant opening hours */}
      </div>
      <h2>Menu</h2> {/* Heading for the menu section */}
      <div className="menu-items"> {/* Container for menu items */}
        {menu.map((dish) => ( // Map over the menu items to create a list
          <div key={dish.id} className="menu-item"> {/* Unique key for each menu item */}
            <h3>{dish.name}</h3> {/* Dish name */}
            <p>{dish.description}</p> {/* Dish description */}
            <p>Price: ${dish.price}</p> {/* Dish price */}
            <button onClick={() => setSelectedDish(dish)}>View Details</button> {/* Button to view dish details */}
            <button onClick={() => handleAddToCart(dish)}>Add to Cart</button> {/* Button to add dish to cart */}
          </div>
        ))}
      </div>
      {selectedDish && ( // Check if a dish is selected for details
        <DishDetailsModal
          dish={selectedDish} // Pass the selected dish to the modal
          onClose={() => setSelectedDish(null)} // Close the modal and clear selected dish
          onAddToCart={() => handleAddToCart(selectedDish)} // Add to cart from modal
        />
      )}
    </div>
  );
};

export default RestaurantMenu; // Export the RestaurantMenu component
