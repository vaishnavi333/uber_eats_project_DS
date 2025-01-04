import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  Divider,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
} from '@mui/material';

// Define the OrdersManagement functional component
const OrdersManagement = () => {
  // Get the restaurant ID from the URL parameters
  const { id } = useParams();
  
  // State to hold the orders fetched from the API
  const [orders, setOrders] = useState([]);
  
  // State to manage loading state while fetching data
  const [loading, setLoading] = useState(true);
  
  // State to hold any error messages encountered during fetching
  const [error, setError] = useState('');
  
  // State to manage the selected filter for order status
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State to manage the selected statuses for each order
  const [selectedStatuses, setSelectedStatuses] = useState({});
  
  // State to hold the success message to be displayed
  const [successMessage, setSuccessMessage] = useState(''); 
  
  // State to manage Snackbar open/close status
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  // Effect hook to fetch orders when the component mounts or the restaurant ID changes
  useEffect(() => {
    fetchOrders(); // Call the function to fetch orders
  }, [id]); // Run effect whenever the restaurant ID changes

  // Asynchronous function to fetch orders for the restaurant
  const fetchOrders = async () => {
    try {
      // Fetch orders using the restaurant ID
      const response = await api.get(`/restaurants/${id}/orders`);
      console.log("Fetching orders for restaurant ID:", id);
      console.log("API Response:", response.data);

      // Set the fetched orders to the state
      setOrders(response.data); 
      
      // Initialize selected statuses for each order
      const initialSelectedStatuses = {};
      response.data.forEach(order => {
        initialSelectedStatuses[order.id] = order.status; // Map order ID to its status
      });
      setSelectedStatuses(initialSelectedStatuses); // Update selected statuses
    } catch (err) {
      // Handle error if fetching orders fails
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Handle changes to the filter dropdown
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value); // Update filter status based on selection
  };

  // Handle changes to the status of a specific order
  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses(prevState => ({
      ...prevState,
      [orderId]: newStatus, // Update the selected status for the specified order
    }));
  };

  // Asynchronous function to update the status of a specific order
  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const newStatus = selectedStatuses[orderId]; // Get the new status for the order
      const response = await api.post(`/orders/updateOrderStatus/`, { status: newStatus, orderId: orderId });
      console.log('Updated order status:', response.data);

      // Show success message and open Snackbar
      setSuccessMessage('Status updated successfully!');
      setSnackbarOpen(true); 
    } catch (error) {
      // Handle error during status update
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Handle closing of the Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  // Filter orders based on the selected filter status
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus);

  // Show loading spinner while fetching data
  if (loading) return <CircularProgress />;
  
  // Show error message if there was an error
  if (error) return <Typography color="error">{error}</Typography>;

  // Render the component's UI
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      <Select value={filterStatus} onChange={handleFilterChange} sx={{ marginBottom: 2 }}>
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="new">New</MenuItem>
        <MenuItem value="delivered">Delivered</MenuItem>
        <MenuItem value="cancelled">Cancelled</MenuItem>
      </Select>

      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        {filteredOrders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          filteredOrders.map(order => (
            <ListItem key={order.id} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography>Status: {order.status.toUpperCase()}</Typography>
                <Select
                  value={selectedStatuses[order.id]}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  sx={{ width: '150px', marginTop: 1 }}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="preparing">Preparing</MenuItem>
                  <MenuItem value="on_the_way">On the Way</MenuItem>
                  <MenuItem value="pickup_ready">Pick Up Ready</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="picked_up">Picked Up</MenuItem>
                </Select>
                {/* Add margin to the Button for spacing */}
                <Button variant="contained" color="primary" onClick={() => handleUpdateOrderStatus(order.id)} sx={{ marginTop: 2, marginLeft: 1 }}>
                  Update Status
                </Button>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />

              <Box sx={{ flex: 2 }}>
                <Typography variant="body1"><strong>Name:</strong> {order.customer.name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {order.customer.email}</Typography>
                <Typography variant="body1"><strong>Phone:</strong> {order.customer.phone_number}</Typography>
                <Typography variant="body1"><strong>Delivery Address:</strong> {order.delivery_address.address_line1}</Typography>
                <Typography variant="body1"><strong>City:</strong> {order.delivery_address.city}</Typography>
                <Typography variant="body1"><strong>State:</strong> {order.delivery_address.state}</Typography>
                <Typography variant="body1"><strong>Country:</strong> {order.delivery_address.country}</Typography>
              </Box>
            </ListItem>
          ))
        )}
      </List>

      {/* Snackbar for displaying success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000} // Auto hide 
        onClose={handleSnackbarClose}
        message={successMessage}
      />
    </Container>
  );
};

export default OrdersManagement;
