import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { Typography, Button, Select, MenuItem } from '@mui/material';
import api, { endpoints } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderDetail.css'; 

// Define the OrderDetail functional component
function OrderDetail() {
  // State variable to hold the order details fetched from the API
  const [order, setOrder] = useState(null); 
  // State variable to hold the currently selected status for the order
  const [selectedStatus, setSelectedStatus] = useState([]); 
  // State variable to manage loading state during API calls
  const [loading, setLoading] = useState(true); 
  // State variable to hold any error messages during data fetching
  const [error, setError] = useState(null); 
  // Extract order ID from URL parameters using useParams hook
  const { id } = useParams(); 

  // Effect hook to fetch order details when the component mounts or when the ID changes
  useEffect(() => {
    // Asynchronous function to fetch order details
    const fetchOrderDetail = async () => {
      try {
        setLoading(true); // Set loading to true before starting the fetch
        console.log(`Fetching data for order ID: ${id}`); // Log the fetching action
        // Fetch order details from the API using the order ID
        const [orderResponse] = await Promise.all([
          api.get(`${endpoints.orderDetail}?orderId=${id}`)
        ]);
        console.log('Order data:', orderResponse.data[0]); // Log the fetched order data
        setOrder(orderResponse.data[0]); // Update state with the fetched order data
        setSelectedStatus(orderResponse.data[0].status); // Set the initial selected status
      } catch (error) {
        // Log error and set error message if the fetch fails
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };
  
    fetchOrderDetail(); // Call the fetch function
  }, [id]); // Dependency array ensures fetch runs when the ID changes

  // Function to handle updating the order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // Send a POST request to update the order status
      const response = await api.post(`/orders/updateOrderStatus/`, { status: newStatus, orderId: orderId });
      console.log('Updated order status:', response.data); // Log the response from the update
    } catch (error) {
      // Log error and alert the user if updating fails
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Render loading spinner while data is being fetched
  if (loading) return <LoadingSpinner />;
  // Render error message if an error occurred during fetching
  if (error) return <div className="text-center text-danger">{error}</div>;
  // Render message if the order is not found
  if (!order) return <div className="text-center">Order not found</div>;

  // Render the component's UI with order details
  return (
    <Container className="order-detail-container">
      <Card className="mb-4">
        <Card.Body>
          <Typography variant="h5" component="div">Order Details</Typography>
          <Card.Text>Dishes and Prices:</Card.Text>
          <Typography variant="body2" color="text.secondary">
          </Typography>
          {/* Dropdown for selecting the order status */}
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)} // Update selected status on change
            className="status-select"
          >
            {/* Menu items for the order status options */}
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="preparing">Preparing</MenuItem>
            <MenuItem value="on_the_way">On the Way</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select> 
          {/* Button to update the order status */}
          <Button variant="contained" onClick={() => handleUpdateOrderStatus(id, selectedStatus)} className="update-button">
            Update Status
          </Button>
        </Card.Body>
      </Card>

      {/* Card displaying customer details */}
      <Card>
        <Card.Body>
          <Typography variant="h5" component="div">Customer Details</Typography>
          <Card.Text>Name: {order.customer.name}</Card.Text>
          <Card.Text>Phone: {order.customer.phone_number}</Card.Text>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Delivery Address:</Typography>
          <Card.Text>Street 1: {order.delivery_address.address_line1}</Card.Text>
          <Card.Text>City: {order.delivery_address.city}</Card.Text>
          <Card.Text>State: {order.delivery_address.state}</Card.Text>
          <Card.Text>Postal Code: {order.delivery_address.postal_code}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

// Export the OrderDetail component for use in other parts of the application
export default OrderDetail;
