import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage'
import WorkflowPage from './pages/WorkflowPage'
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PotholePage from './pages/PotholePage';

const App = () => {
  return(
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/pothole" element={<PotholePage />} />
      </Routes>
    </Router>
  );
};

export default App;
