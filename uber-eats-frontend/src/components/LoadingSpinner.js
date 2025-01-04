import React from 'react'; 
import { CircularProgress, Box } from '@mui/material'; 

// Define a functional component for the loading spinner
const LoadingSpinner = () => (
  // Box component for centering the spinner within its container
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress /> {/* Render the loading spinner */}
  </Box>
);

export default LoadingSpinner; // Export the LoadingSpinner component for use in other parts of the application
