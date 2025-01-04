import React, { createContext, useState, useEffect } from 'react';
import api, { endpoints } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Get user as a string

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Attempt to parse user
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error); // Handle parsing error
      }
    }
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(endpoints.customerProfile);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post(endpoints.customerLogin, { username, password });
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', "customer")

      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginRestaurant = async (username, password) => {
    try {
      const response = await api.post(endpoints.restaurantLogin, { username, password });
      console.log('Login response:', response.data); // Log the response for debugging
      
      const { token, user_id, restaurant_id } = response.data; // Ensure this matches your backend response structure

      if (!token || !user_id) {
        throw new Error('Invalid login response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id: user_id })); // Store only necessary user data
      localStorage.setItem('restaurant_id', restaurant_id); // Store restaurant id if needed
      localStorage.setItem('userType', "restaurant")
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      setUser({ id: user_id }); // Update state with user ID
      return restaurant_id;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('restaurant_id'); 
    localStorage.removeItem('userType');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const signupRestaurant = async (username, email, password, restaurantName, address) => {
    try {
      const response = await api.post(endpoints.restaurantSignup, {
        username,
        email,
        password,
        restaurant_name: restaurantName,
        address,
      });
      
      return true;
    } catch (error) {
      console.error('Restaurant signup error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginRestaurant, logout, fetchUser , signupRestaurant }}>
      {children}
    </AuthContext.Provider>
  );
};

