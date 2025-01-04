import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Image, Form } from 'react-bootstrap';
import { Typography, Button, TextField, Box, Input, InputAdornment, MenuItem, Select, FormControl, InputLabel } 
from '@mui/material';
import api, { endpoints } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

function Dish() {
  // State to hold dish details and form inputs
  const [dish, setDish] = useState(null);
  const [nameEntered, setNameEntered] = useState(''); // State for dish name input
  const [ingredientsEntered, setingredientsEntered] = useState(''); // State for ingredients input
  const [descriptionEntered, setDescriptionEntered] = useState(''); // State for description input
  const [priceEntered, setPriceEntered] = useState(''); // State for price input
  const [categorySelected, setCategorySelected] = useState(''); // State for selected category
  const category = ["Appetizer", "Salad", "Main Course", "Dessert", "Beverage"]; // Array of categories for dropdown
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State to hold error messages
  const { id } = useParams(); // Get the dish ID from the URL parameters
  const [profilePicture, setProfilePicture] = useState(null); // State to hold the profile picture file

  // Check if user is logged in by verifying token in local storage
  const loggedIn = localStorage.getItem('token') !== null;

  // Effect to fetch dish details when component mounts or ID changes
  useEffect(() => {
    const fetchDishDetail = async () => {
      try {
        setLoading(true); // Set loading to true while fetching data
        if (id) {
          // Fetch dish details from API
          const [dishResponse] = await Promise.all([
            api.get(`${endpoints.getDish}?dishId=${id}`)
          ]);
          // Set dish details and input states from fetched data
          setDish(dishResponse.data[0]);
          setNameEntered(dishResponse.data[0].name || '');
          setingredientsEntered(dishResponse.data[0].ingredients || '');
          setDescriptionEntered(dishResponse.data[0].description || '');
          setPriceEntered(dishResponse.data[0].price || '');
          setCategorySelected(dishResponse.data[0].category || '');
          setProfilePicture(dishResponse.data[0].image || null);
          console.log(dishResponse.data[0]); // Log fetched dish data for debugging
        }
      } catch (error) {
        console.error('Error fetching dish details:', error); // Log any error encountered
        setError('Failed to load dish details. Please try again.'); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchDishDetail(); // Call the fetch function
  }, [id]); // Dependency array to re-fetch when ID changes

  // Function to handle profile picture file input change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setProfilePicture(file); // Update profile picture state
      console.log(profilePicture); // Log profile picture for debugging
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  // Function to handle updating the dish details
  const handleUpdateDish = async (dishId) => {
    try {
      const formDataToSend = new FormData(); // Create a FormData object to send
      // Append input values to the FormData object
      formDataToSend.append('name', nameEntered);
      formDataToSend.append('ingredients', ingredientsEntered);
      formDataToSend.append('description', descriptionEntered);
      formDataToSend.append('category', categorySelected);
      formDataToSend.append('price', priceEntered);

      // Append profile picture if provided
      if (profilePicture) {
          formDataToSend.append('image', profilePicture);
      }

      // Send PUT request to update dish details
      const response = await api.put(`${endpoints.editDish}/?dishId=${dishId}`, formDataToSend);
      console.log('Updated dish details:', response.data); // Log response for debugging
      alert('Dish updated Successfully'); // Alert user of success
    } catch (error) {
      console.error('Error updating dish details:', error); // Log any error encountered
      alert('Failed updating dish details. Please try again.'); // Alert user of failure
    }
  };

  // Function to handle adding a new dish
  const handleAddDish = async () => {
    try {
      // Send PUT request to add a new dish
      const response = await api.put(`${endpoints.addDish}/?dishId=${id}`, {
        name: nameEntered,
        ingredients: ingredientsEntered,
        description: descriptionEntered,
        category: categorySelected
      });
      console.log('Added dish details:', response.data); // Log response for debugging
      alert('Dish added Successfully'); // Alert user of success
    } catch (error) {
      console.error('Error adding dish details:', error); // Log any error encountered
      alert('Failed adding dish details. Please try again.'); // Alert user of failure
    }
  };

  // Show loading spinner while data is loading
  if (loading) return <LoadingSpinner />;
  // Show error message if there's an error
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <Container>
      <Card className="dish-card">
        <Card.Body>
          <Typography variant="h5" component="div">Dish Details</Typography>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
            noValidate
            autoComplete="off"
          >
            {/* Input field for dish name */}
            <TextField
              label="Name"
              variant="outlined"
              defaultValue={dish ? dish.name : ''}
              size="small"
              onChange={(e) => setNameEntered(e.target.value)}
            />
            
            {/* Input field for ingredients */}
            <TextField
              label="Ingredients"
              variant="outlined"
              defaultValue={dish ? dish.ingredients : ''}
              multiline
              rows={4}
              onChange={(e) => setingredientsEntered(e.target.value)}
            />

            {/* Input field for dish description */}
            <TextField
              label="Description"
              variant="outlined"
              defaultValue={dish ? dish.description : ''}
              multiline
              rows={4}
              onChange={(e) => setDescriptionEntered(e.target.value)}
            />
            {/* Input field for price */}
            <Input
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Price"
              onChange={(e) => setPriceEntered(e.target.value)}
              defaultValue={dish ? dish.price : ''}
              sx={{ m: 1, width: '30ch' }} 
            />
          </Box>

          {/* Dropdown for selecting category */}
          <FormControl sx={{ m: 1, width: '30ch' }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={categorySelected}
              label="Category"
              onChange={(e) => setCategorySelected(e.target.value)}
              required
            >
              {category.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Display current dish image */}
          <Image src={"http://localhost:8000" + profilePicture || 'default-avatar.png'} fluid />
          {/* Input for updating dish image */}
          <Form.Group controlId="formProfilePicture" className="mt-2">
            <Form.Label>Update Dish Image</Form.Label>
            <Form.Control type="file" onChange={(e) => handleProfilePictureChange(e)} accept="image/*" />
          </Form.Group>
          {loggedIn && // Only show button if user is logged in
            <Button
              variant="contained"
              onClick={() => (id ? handleUpdateDish(id) : handleAddDish())} // Call update or add function based on existence of ID
              className="update-button"
            > 
              {id ? 'Update Dish' : 'Add Dish'} {/* Button text based on action */}
            </Button>
          }
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dish;
