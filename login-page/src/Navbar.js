import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Read user from localStorage to display name greeting
  let userName = '';
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u?.name) {
        userName = u.name.split(' ')[0];
      }
    }
  } catch (e) {}

  // Hide navbar on auth pages
  const authPages = ['/login', '/signup', '/verify-otp', '/auth/callback'];
  if (authPages.includes(location.pathname)) {
    return null;
  }

  const logout = () => {
    handleLogout(); // Reset authentication state
    navigate("/"); // Redirect to the home page
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon"></span>
          <span className="logo-text">Pothole Detector</span>
        </Link>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/workflow" onClick={closeMenu}>Workflow</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          {isLoggedIn && userName && (
            <li className="user-greeting" aria-label={`Logged in as ${userName}`}>
              <span className="greet-badge">Hi, {userName} 👋</span>
            </li>
          )}
          {/* Conditional rendering based on authentication state */}
          {isLoggedIn ? (
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          ) : (
            <li><Link to="/login" className="login-btn" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
