import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import { useCart, CartProvider } from './context/CartContext'; 
import Header from './components/Header';
import CustomerLogin from './pages/CustomerLogin';
import RestaurantLogin from './pages/RestaurantLogin';
import Signup from './pages/Signup';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetails from './pages/RestaurantDetails';
import RestaurantDashboard from './pages/RestaurantDashboard';
import ProfileManagement from './pages/ProfileManagement'; 
import OrdersManagement from './pages/OrdersManagement'; 
import UserProfile from './pages/UserProfile';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import OrderPlacement from './components/OrderPlacement';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignupSelection from './pages/SignupSelection';
import RestaurantSignup from './pages/RestaurantSignup';
import FavoriteRestaurants from './pages/FavoriteRestaurants';
import OrderDetail from './pages/OrderDetail';
import Dish from './pages/Dish';
import 'bootstrap/dist/css/bootstrap.min.css';
import RestaurantHeader from './components/RestaurantHeader';
import DefaultHeader from './components/DefaultHeader';


function AppContent() {
  const location = useLocation();
  const { cartCount } = useCart(); // Get cartCount from CartContext
  const getHeader = () => {
    const userType = localStorage.getItem('userType')
    const loggedIn = localStorage.getItem('token')

    if(loggedIn){
    if(location.pathname !== '/' && userType === 'restaurant') {
      return <RestaurantHeader id={localStorage.getItem('restaurant_id')}/>
    } else if(location.pathname !== '/' && userType === 'customer') {
      return <Header cartCount={cartCount} />
    }
  } else if(location.pathname !== '/' ){
    return <DefaultHeader/>
  }
    
  }
  return (
    <>
      {getHeader()}
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/home" element={<RestaurantList />} />
          <Route path="/restaurant/:id/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/profile" element={<ProfileManagement />} />
          <Route path="/restaurant/:id/orders" element={<OrdersManagement />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/order-details/:id" element={<OrderDetail />} />
          <Route path="/dish/edit/:id" element={<Dish />} />
          <Route path="/dish/add" element={<Dish />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-selection" element={<SignupSelection />} />
          <Route path="/restaurant/signup" element={<RestaurantSignup />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/favorites" element={<FavoriteRestaurants />} />
          <Route 
              path="/userprofile" 
              element={
              <ProtectedRoute>
                  <UserProfile />
              </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-history" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-placement" 
              element={
                <ProtectedRoute>
                  <OrderPlacement />
                </ProtectedRoute>
              } 
            />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
