import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setAlertType('error');
      return;
    }
    console.log('Form submitted with:', { name, email, password, confirmPassword });

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        setAlertMessage('Sign up successful! Redirecting to login...');
        setAlertType('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Wait 3 seconds before redirecting
      } else {
        setAlertMessage(result.error || 'Signup failed. Please try again.');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Error signing up. Please try again.');
      setAlertType('error');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Alert Message (Top-Right) */}
      {alertMessage && (
        <div className={`${styles.alert} ${styles[alertType]}`}>
          {alertMessage}
        </div>
      )}

      {/* Signup Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>

      {/* Login Link */}
      <a href="/login" className={styles.link}>Already have an account? Log in</a>
    </div>
  );
};

export default SignUpPage;