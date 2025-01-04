import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Image } from 'react-bootstrap';
import api, { endpoints } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './RestaurantDetails.css';

function RestaurantDetails() {
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [newDishId, setNewDishId] = useState(null);
  const [restaurantNamesInCart, setRestaurantNamesInCart] = useState(new Set());
  const [cartItems, setCartItems] = useState([]); 
  const [cartCount, setCartCount] = useState(0); 
  const loggedIn = localStorage.getItem('token') !== null

  useEffect(() => {
    const fetchRestaurantAndDishes = async () => {
      if (!id) {
        console.error("Restaurant ID is undefined.");
        setError('Restaurant ID not found.');
        setLoading(false);
        return; // Stop the fetch function if ID is undefined
    }  
      try {
            setLoading(true);
            console.log(`Fetching data for restaurant ID: ${id}`);
            const [restaurantResponse, dishesResponse] = await Promise.all([
                api.get(`${endpoints.restaurants}${id}/`),
                api.get(`${endpoints.restaurants}${id}/dishes/`)
            ]);
            setRestaurant(restaurantResponse.data);
            console.log(restaurantResponse.data)
            setDishes(dishesResponse.data);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            setError('Failed to load restaurant details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    fetchRestaurantAndDishes();
}, [id]);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
        try {
            const cartResponse = await api.get(endpoints.cartItems);
            // console.log("Fetched Cart Items:", cartResponse.data); 
            setCartItems(cartResponse.data); // Store cart items
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    fetchCartItems();
}, []);

  // Update cart count whenever cartItems changes //New
  useEffect(() => {
    const count = cartItems.length; // Update cart count
    // console.log("Cart Count Updated:", count);
    setCartCount(count);
  }, [cartItems]);

const fetchRestaurantNames = async (restaurantIds) => {
  const restaurantNames = new Map();
  const fetchPromises = restaurantIds.map(async (rest_id) => {
      // Check if rest_id is defined
      if (!rest_id) {
          console.error("Undefined restaurant ID detected.");
          return; // Skip fetching for this ID
      }
      try {
          const restaurantResponse = await api.get(`${endpoints.restaurants}${rest_id}/`);
          restaurantNames.set(rest_id, restaurantResponse.data.name);
      } catch (error) {
          console.error(`Error fetching restaurant ID ${rest_id}:`, error);
          restaurantNames.set(rest_id, 'Unknown Restaurant'); 
      }
  });
  await Promise.all(fetchPromises);
  return restaurantNames;
};


  const handleAddToCart = async (dishId) => {
    try {
      const restaurantIdsInCart = new Set(cartItems
        .map(item => item.restaurant)
        .filter(restId => restId !== undefined) // Filter out undefined values
      );
       const currentRestaurantId = restaurant?.id || 'unknown';
      
      const namesInCart = new Set(cartItems.map(item => item.dish.restaurant));
      setRestaurantNamesInCart(namesInCart);

      if (restaurantIdsInCart.size > 0 && !restaurantIdsInCart.has(currentRestaurantId)) {
        const restaurantNames = await fetchRestaurantNames([...restaurantIdsInCart]);
        const existingRestaurantId = [...restaurantIdsInCart][0];
        const existingRestaurantName = restaurantNames.get(existingRestaurantId);
        setNewDishId(dishId);
        setShowModal(true);
        setRestaurantNamesInCart(new Set([existingRestaurantName]));
      } else {
        await addDishToCart(dishId,currentRestaurantId);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to fetch cart items. Please try again.');
    }
  };


  const addDishToCart = async (dishId, restaurantId) => {
    try {

       // Check if the dish is already in the cart
       const existingCartItem = cartItems.find(item => item.dish.id === dishId && item.restaurant === restaurantId);
       
       if (existingCartItem) {
        // If the item is already in the cart, increment the quantity
        await api.patch(`${endpoints.cartItems}${existingCartItem.id}/`, { quantity: existingCartItem.quantity + 1 });
       } else {
        // If the item is not in the cart, add it as a new entry
        await api.post(endpoints.addToCart, { 
            dish_id: dishId, 
            restaurant_id: restaurantId, 
            quantity: 1 
        });
       }
        // Fetch updated cart items after adding
        const cartResponse = await api.get(endpoints.cartItems);
        setCartItems(cartResponse.data); // Update cart items state

        // Show alert after a delay
        setTimeout(() => {
            alert('Dish added to cart successfully!');
        }, 100); // 100 milliseconds delay
    } catch (error) {
        console.error('Error adding dish to cart:', error);
        alert('Failed to add dish to cart. Please try again.');
    }
};


  const handleConfirmNewOrder = async () => {
    await addDishToCart(newDishId);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-danger">{error}</div>;
  const existingRestaurantName = Array.from(restaurantNamesInCart).pop() || 'Unknown Restaurant';


  if (!restaurant) return <div className="text-center">Restaurant not found</div>;

  return (
    <Container className="restaurant-details">
      <h1 className="restaurant-name mb-4">{restaurant.name}</h1>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Description:</strong> {restaurant.description}</p>
      <p><strong>Phone:</strong> {restaurant.phone_number}</p>
      <p><strong>Opening Time:</strong> {restaurant.opening_time}</p>
      <p><strong>Closing Time:</strong> {restaurant.closing_time}</p>
      {/* <p><strong>Rating:</strong> {restaurant.rating}</p> */}
      <p><strong>Items in Cart:</strong> {cartCount}</p> {/* Display cart count */}

      <h2 className="menu-title mt-5 mb-4">Menu</h2>
      {!loggedIn &&
          <p>Login to place an order</p>
      }
      {dishes.length === 0 ? (
        <p>No dishes available for this restaurant.</p>
      ) : (
        <Row>
          {dishes.map(dish => (
            <Col key={dish.id} md={4} className="mb-4">
              <Card className="dish-card" >
                {dish.image && 
                <Image className = "dish-image" src={"http://localhost:8000" + dish.image} alt={dish.name} fluid />
                } 
                {!dish.image && 
                <Image className = "dish-image" src={"https://img.freepik.com/free-photo/top-view-delicious-vegetable-salad-inside-plate-grey-background_140725-125661.jpg"} alt={dish.name} fluid />
                }
                <Card.Body>
                  <Card.Title className="dish-name">{dish.name}</Card.Title>
                  <Card.Text className="dish-category">{dish.category}</Card.Text>
                  <Card.Text className="dish-ingredients" style={{ fontStyle: 'italic' , fontSize: '13px'}}>{dish.ingredients}</Card.Text>
                  <Card.Text className="dish-description">{dish.description}</Card.Text>
                  <Card.Text><strong>Price:</strong> ${isNaN(dish.price) ? 'N/A' : Number(dish.price).toFixed(2)}</Card.Text>
                  {loggedIn &&
                  <Button variant="primary" onClick={() => handleAddToCart(dish.id)}>Add to Cart</Button>
                  }
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Order?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your order contains items from {existingRestaurantName}. 
          Create a new order to add items from {restaurant.name}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmNewOrder}>
            New Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RestaurantDetails;
