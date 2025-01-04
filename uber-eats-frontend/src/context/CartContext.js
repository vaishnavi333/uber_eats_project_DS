import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = React.createContext(); // Create a Context for the cart

// CartProvider component to provide cart data to its children
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(new Map()); // State to hold cart items as a Map for easy item management
  const [cartCount, setCartCount] = useState(0); // State to keep track of the total number of items in the cart

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount }}> {/* Provide cart data and functions to the children */}
        {children} {/* Render child components */}
    </CartContext.Provider>
   );

};

// Custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext); // Return the context value for easy access in components
};



