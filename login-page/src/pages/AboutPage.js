// About.js
import React from "react";
import "./AboutPage.css";

const About = () => {
  return (
    <div className="about">
      <header className="about-header">
        <h1>About Pothole Detector</h1>
        <p>
          Pothole Detector is an innovative application designed to identify and
          analyze potholes using advanced machine learning techniques.
        </p>
      </header>

      <section className="about-content">
        <h2>Our Mission</h2>
        <p>
          To improve road safety and reduce vehicular damage by providing a
          reliable and accessible pothole detection system.
        </p>

        <h2>How It Works</h2>
        <p>
          Users can upload images of roads, and our system will detect potholes
          with high accuracy, leveraging state-of-the-art neural networks.
        </p>

        <h2>Our Team</h2>
        <p>
          We are a group of passionate developers and data scientists dedicated
          to making roads safer for everyone.
        </p>
      </section>
    </div>
  );
};

export default About;
