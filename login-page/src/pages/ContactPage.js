import React, { useState } from 'react';
import './ContactPageNew.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
    try {
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='ConatactPagebody'>
        <div className="contact-container">
        <h1 className="contact-title">Contact Us 📧</h1>
        <p className="contact-subtitle">We'd love to hear from you! Drop us a message below.</p>
        
        {submitStatus === 'success' && (
          <div className="alert alert-success">
            ✅ Message sent successfully! We'll get back to you soon.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="alert alert-error">
            ❌ Oops! Something went wrong. Please try again.
          </div>
        )}
        
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
            />
            </div>
            <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
            />
            </div>
            <div className="input-group">
            <label htmlFor="message">Your Message</label>
            <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here"
                rows="5"
                required
                disabled={isSubmitting}
            />
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
        </div>
    </div>
  );
};

export default ContactPage;
