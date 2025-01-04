import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

// DishDetailsModal component displays detailed information about a dish in a modal dialog
const DishDetailsModal = ({ open, onClose, dish }) => {
  // If no dish is provided, don't render anything
  if (!dish) return null;

  return (
    // Dialog component from Material-UI, controlled by 'open' prop
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Dialog title displays the name of the dish */}
      <DialogTitle>{dish.name}</DialogTitle>
      <DialogContent>
        {/* Grid container for responsive layout */}
        <Grid container spacing={2}>
          {/* Left column: Dish image */}
          <Grid item xs={12} md={6}>
            <img src={dish.image} alt={dish.name} style={{ width: '100%', height: 'auto' }} />
          </Grid>
          {/* Right column: Dish details */}
          <Grid item xs={12} md={6}>
            {/* Description section */}
            <Typography variant="h6">Description</Typography>
            <Typography paragraph>{dish.description}</Typography>
            {/* Ingredients section */}
            <Typography variant="h6">Ingredients</Typography>
            <Typography paragraph>{dish.ingredients}</Typography>
            {/* Price section */}
            <Typography variant="h6">Price</Typography>
            <Typography>${dish.price.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      {/* Dialog actions (buttons) */}
      <DialogActions>
        {/* Close button */}
        <Button onClick={onClose} color="primary">Close</Button>
        {/* Add to Cart button */}
        <Button onClick={() => {/* Add to cart logic */}} color="primary" variant="contained">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DishDetailsModal;