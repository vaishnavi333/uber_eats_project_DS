import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 


// Functional component for displaying a restaurant's menu
const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null); // State to hold the restaurant details
  const [menu, setMenu] = useState([]); // State to hold the menu items (dishes)
  const [selectedDish, setSelectedDish] = useState(null); // State to hold the currently selected dish
  const { id } = useParams(); // Extract restaurant ID from URL parameters
  const { user } = useContext(AuthContext); // Access the current user from AuthContext
  const { addToCart } = useCart(); // Use the CartContext to access the addToCart function

  // useEffect hook to fetch restaurant and menu data when the component mounts or the ID changes
  useEffect(() => {
    fetchRestaurantAndMenu();
  }, [id]);

  // Async function to fetch restaurant details and menu items
  const fetchRestaurantAndMenu = async () => {
    try {
      const restaurantResponse = await api.get(`/restaurants/${id}/`); // Fetch restaurant details
      setRestaurant(restaurantResponse.data); // Set restaurant state with fetched data
      const menuResponse = await api.get(`/restaurants/${id}/dishes/`); // Fetch the menu items for the restaurant
      setMenu(menuResponse.data); // Set menu state with fetched dishes
    } catch (error) {
      console.error('Error fetching restaurant and menu:', error); // Log error if fetching fails
    }
  };

  // Function to handle adding a dish to the cart
  const handleAddToCart = (dish) => {
    if (!user) {
      alert('Please log in to add items to your cart'); // Alert user to log in if not authenticated
      return; // Exit the function if user is not logged in
    }

    try {
      addToCart(dish); // Call addToCart function to add the dish to the cart
      alert('Item added to cart successfully!'); // Alert user of successful addition
    } catch (error) {
      console.error('Error adding item to cart:', error); // Log error if adding fails
      alert('Failed to add item to cart. Please try again.'); // Alert user of failure
    }
  };

  // Render loading state while restaurant data is being fetched
  if (!restaurant) return <div>Loading...</div>; // Show loading message if restaurant data is not yet available

  return (
    <div className="restaurant-menu">
      <div className="restaurant-details">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <p>Location: {restaurant.location}</p>
        <p>Contact: {restaurant.contact_info}</p>
        <p>Opening Hours: {restaurant.opening_time} - {restaurant.closing_time}</p>
      </div>
      <h2>Menu</h2>
      <div className="menu-items">
        {menu.map((dish) => (
          <div key={dish.id} className="menu-item">
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <p>Price: ${dish.price}</p>
            <button onClick={() => setSelectedDish(dish)}>View Details</button>
            <button onClick={() => handleAddToCart(dish)}>Add to Cart</button>
          </div>
        ))}
      </div>
      {selectedDish && (
        <DishDetailsModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={() => handleAddToCart(selectedDish)}
        />
      )}
    </div>
  );
};

export default RestaurantMenu;
