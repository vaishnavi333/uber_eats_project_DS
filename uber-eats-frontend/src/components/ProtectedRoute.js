import React, { useContext } from 'react'; 
import { Navigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 

// Define the ProtectedRoute functional component
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext); // Access user and loading state from AuthContext

  // If the loading state is true, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no user (not authenticated), redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children components
  return children;
}

export default ProtectedRoute; // Export the ProtectedRoute component
