import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    console.log('Form submitted with:', { email, password });

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        const { token } = result; // Assume the backend sends a token
        localStorage.setItem('authToken', token); // Store the token
        setIsLoggedIn(true); // Update the login state
        setAlertMessage('Login successful!');
        setAlertType('success');
        setTimeout(() => {
          navigate('/pothole'); // Redirect to the pothole page
        }, 3000); // Wait 3 seconds before redirecting
      } else {
        setAlertMessage(result.error || 'Login failed');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Error logging in. Please try again.');
      setAlertType('error');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className={styles.container}>
      {alertMessage && (
        <div className={`${styles.alert} ${alertType === 'success' ? styles.success : styles.error}`}>
          {alertMessage}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <a href="/signup" className={styles.link}>
        Don't have an account? Sign up
      </a>
    </div>
  );
};

export default LoginPage;
