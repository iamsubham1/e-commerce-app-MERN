import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store/store';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import AccountSetup from './pages/AccountSetup';
import ProductPage from './pages/ProductPage';
import Phones from './pages/PhonesPage';
import Cart from './pages/CartPage';
import Footer from './components/Footer';
import OrdersPage from './pages/OrdersPage';
import LaptopPage from './pages/LaptopPage';
import ElectronicsPage from './pages/ElectronicsPage';
import AudioPage from './pages/AudioPage';
import Checkout from './pages/Checkout';
import './components/css/navbar.css';
import Profile from './pages/ProfilePage';
import ResetPassword from './pages/resetPassword';
import PhonePe from './pages/PhonePe';
import SuccessPage from './pages/successPage';
import LoadingPage from './pages/serverNotReady';  // Import LoadingPage component
import { serverAlive } from './apis/api';  // Mock server status API

const App = () => {
  const [isServerReady, setIsServerReady] = useState(() => {
    // Check local storage for server readiness
    const storedValue = localStorage.getItem('serverReady');
    return storedValue === 'true';
  });

  const [isPolling, setIsPolling] = useState(true);  // Polling state
  const [retryCount, setRetryCount] = useState(0);   // Retry counter

  // Max retries to avoid infinite polling
  const MAX_RETRIES = 10;

  // Polling function to check server status
  const checkServerStatus = async () => {
    try {
      const response = await serverAlive();

      // Since we're getting JSON response, check it directly
      if (response === "health is running ok") {
        setIsServerReady(true);  // Server is ready
        setIsPolling(false);      // Stop polling
        localStorage.setItem('serverReady', 'true'); // Update local storage
      } else {
        console.error('Unexpected server response:', response);
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      if (retryCount >= MAX_RETRIES) {
        setIsPolling(false);  // Stop polling after max retries
        localStorage.setItem('serverReady', 'false'); // Update local storage
      }
    }
  };

  // Polling effect
  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(() => {
        checkServerStatus();
        setRetryCount((prevCount) => prevCount + 1);  // Increment retry counter
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);  // Cleanup on unmount
    }
  }, [isPolling]);

  // Initial server status check
  useEffect(() => {
    if (!isServerReady) {
      checkServerStatus();
    }
  }, [isServerReady]);

  // Render loading page if server is not ready
  if (!isServerReady) {
    return <LoadingPage />;  // Show animated loading page
  }

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/googleloginnextstep" element={<AccountSetup />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/mobile" element={<Phones />} />
          <Route path="/electronics" element={<ElectronicsPage />} />
          <Route path="/headphone" element={<AudioPage />} />
          <Route path="/laptop" element={<LaptopPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/phonePe" element={<PhonePe />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
