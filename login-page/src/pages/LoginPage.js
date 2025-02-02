import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });

    try {
      const response = await fetch('http://192.168.196.2:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        setAlertMessage('Login successful!');
        setAlertType('success');
        setTimeout(() => {
          navigate('/pothole');
        }, 3000); // Wait 3 seconds before redirecting
      } else {
        setAlertMessage(result.error);
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Error logging in. Please try again.');
      setAlertType('error');
      console.error('Error logging in:', error);
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
        <button type="submit" className={styles.button}>Log In</button>
      </form>
      <a href="/signup" className={styles.link}>
        Don't have an account? Sign up
      </a>
    </div>
  );
};

export default LoginPage;
