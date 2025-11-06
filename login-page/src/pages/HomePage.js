import React from "react";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import "./HomePageNew.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      navigate('/pothole');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Pothole Detector</h1>
        <p>
          A smart solution to detect potholes and ensure safer roads for everyone.
          Using cutting-edge AI technology to make our roads better.
        </p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </header>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>🎯 Accuracy</h3>
            <p>Our model provides highly accurate pothole detection results with 95%+ confidence using advanced CNN models.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Efficiency</h3>
            <p>Detect potholes quickly and easily with our intuitive interface. Get results in seconds, not minutes.</p>
          </div>
          <div className="feature-card">
            <h3>📱 Accessibility</h3>
            <p>Upload images and get results instantly, anywhere, anytime. Works seamlessly across all devices.</p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
