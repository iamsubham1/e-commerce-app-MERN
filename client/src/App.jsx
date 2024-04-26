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
          <Route path="/phone" element={<Phones />} />
        </Routes>

      </Router>
    </Provider>
  );
};

export default App;
