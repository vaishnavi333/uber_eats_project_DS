import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  // Initialize state
  state = { hasError: false, isLoading: false };

  // Lifecycle method to update state when an error occurs
  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return { hasError: true };
  }

  // Lifecycle method to perform side effects when an error is caught
  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  // Method to simulate error resolution (for demonstration purposes)
  handleRetry = () => {
    this.setState({ isLoading: true });
    // Simulate an asynchronous operation
    setTimeout(() => {
      this.setState({ hasError: false, isLoading: false });
    }, 2000);
  }

  render() {
    // If there's an error, show error UI
    if (this.state.hasError) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="h5" gutterBottom>Something went wrong.</Typography>
          {this.state.isLoading ? (
            <CircularProgress />
          ) : (
            <button onClick={this.handleRetry}>Retry</button>
          )}
        </Box>
      );
    }

    // If no error, render children components
    return this.props.children;
  }
}

export default ErrorBoundary;