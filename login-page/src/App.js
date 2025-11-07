// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import Layout from './Layout';  // Import the Layout component
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkflowPage from './pages/WorkflowPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import PotholePage from './pages/PotholePage';
import LifeSaverPage from './pages/LifeSaverPage';
import { isAuthenticated } from './utils/auth';
import { Navigate } from 'react-router-dom';
import NewsPage from './pages/NewsPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());

  // Keep state in sync with localStorage updates (e.g., across tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'authToken') {
        setIsLoggedIn(isAuthenticated());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false); // Reset the login state
    localStorage.removeItem('authToken'); // Remove the token
    localStorage.removeItem('user'); // Remove user data
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        {/* Auth pages without Layout */}
        {/* If already authenticated, redirect away from login/signup/verify pages */}
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/pothole" replace /> : <SignupPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/pothole" replace /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/verify-otp" element={<VerifyOTPPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage setIsLoggedIn={setIsLoggedIn} />} />
        
        {/* Other routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pothole" element={<PotholePage />} />
          <Route path="/lifesaver" element={<LifeSaverPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
