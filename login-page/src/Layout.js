// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';  // Allows rendering child routes
import './Layout.css';  // Import your CSS file for styling
const Layout = () => {
  return (
    <div className="app-container">
      <div className="content">
        <Outlet />  {/* This renders the content of the current route */}
      </div>
      <footer className="footer">
        <p>&copy; 2025 Pothole Detector. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
