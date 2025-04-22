import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkflowPage from './pages/WorkflowPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PotholePage from './pages/PotholePage';
import LifeSaverPage from './pages/LifeSaverPage';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset the login state
    localStorage.removeItem('authToken'); // Remove the token (if stored)
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/pothole" element={<PotholePage />} />
        <Route path="/lifesaver" element={<LifeSaverPage />} />
      </Routes>
    </Router>
  );
};

export default App;
