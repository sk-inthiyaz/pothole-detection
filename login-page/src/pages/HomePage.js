import React from "react";
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Pothole Detector</h1>
        <p>
          A smart solution to detect potholes and ensure safer roads for everyone.
        </p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </header>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Accuracy</h3>
            <p>Our model provides highly accurate pothole detection results.</p>
          </div>
          <div className="feature-card">
            <h3>Efficiency</h3>
            <p>Detect potholes quickly and easily with our intuitive interface.</p>
          </div>
          <div className="feature-card">
            <h3>Accessibility</h3>
            <p>Upload images and get results instantly, anywhere, anytime.</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2025 Pothole Detector. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
