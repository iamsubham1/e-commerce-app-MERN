import React from 'react';
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
import './components/css/navbar.css'

const App = () => {


  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/googleloginnextstep" element={<AccountSetup />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/mobile" element={<Phones />} />
          <Route path="/electronics" element={<ElectronicsPage />} />
          <Route path="/headphone" element={<AudioPage />} />
          <Route path="/laptop" element={<LaptopPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
