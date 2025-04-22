import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout(); // Reset authentication state
    navigate("/"); // Redirect to the home page
  };

  return (
    <nav className="navbar">
      <div className="logo">Pothole Detector</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/workflow">Workflow</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {/* Conditional rendering based on authentication state */}
        {isLoggedIn ? (
          <li><button onClick={logout} className="logout">Logout</button></li>
        ) : (
          <li><Link to="/login" className="login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
