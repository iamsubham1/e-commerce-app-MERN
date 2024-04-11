import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';


const App = () => {
  return (
    <Router>

      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />


        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  )
}

export default App
