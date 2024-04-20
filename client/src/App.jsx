import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store/store';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import { useNavigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import AccountSetup from './pages/AccountSetup';

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
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
