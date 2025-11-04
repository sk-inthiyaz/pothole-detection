// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import './LayoutNew.css';

const Layout = () => {
  return (
    <div className="app-container">
      <div className="content">
        <Outlet />
      </div>
      <footer className="footer">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/workflow">Workflow</a>
          <a href="/contact">Contact</a>
        </div>
        <p>&copy; 2025 Pothole Detector. All Rights Reserved.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
          Making roads safer with AI
        </p>
      </footer>
    </div>
  );
}

export default Layout;
