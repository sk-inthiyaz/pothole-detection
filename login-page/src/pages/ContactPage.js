import React, { useState, useEffect } from 'react';
import './ContactPageNew.css';
import { getBackendUrl } from '../utils/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

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

    const backendUrl = getBackendUrl();
    console.log('[Contact] Using backend:', backendUrl);
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
        {/* Toast Notification - Fixed position top-right */}
        {submitStatus && (
          <div className={`toast-notification ${submitStatus === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {submitStatus === 'success' ? '✅' : '❌'}
              </span>
              <div className="toast-text">
                <strong>{submitStatus === 'success' ? 'Success!' : 'Error!'}</strong>
                <p>
                  {submitStatus === 'success' 
                    ? 'Message sent successfully! We\'ll get back to you soon.' 
                    : 'Oops! Something went wrong. Please try again.'}
                </p>
              </div>
              <button 
                className="toast-close" 
                onClick={() => setSubmitStatus(null)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <div className="contact-container">
        <h1 className="contact-title">Contact Us 📧</h1>
        <p className="contact-subtitle">We'd love to hear from you! Drop us a message below.</p>
        
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
