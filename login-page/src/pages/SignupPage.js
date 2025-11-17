import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPageNew.module.css';
import { getBackendUrl } from '../utils/api';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage('');

    // Client-side validation
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setAlertType('error');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setAlertMessage('Password must be at least 6 characters long.');
      setAlertType('error');
      setLoading(false);
      return;
    }

    console.log('Form submitted with:', { name, email, password });

    const backendUrl = getBackendUrl();
    console.log('[Signup] Using backend:', backendUrl);
    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        if (result.requiresVerification) {
          setAlertMessage('✅ Sign up successful! Please check your email for OTP verification.');
          setAlertType('success');
          setTimeout(() => {
            navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 2000);
        } else {
          setAlertMessage('Sign up successful! Redirecting to login...');
          setAlertType('success');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        if (result.needsVerification) {
          setAlertMessage(result.error + ' Redirecting to verification...');
          setAlertType('warning');
          setTimeout(() => {
            navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
          }, 2000);
        } else {
          setAlertMessage(result.error || 'Signup failed. Please try again.');
          setAlertType('error');
        }
      }
    } catch (error) {
      setAlertMessage('Error signing up. Please try again.');
      setAlertType('error');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = (provider) => {
    // Redirect to backend OAuth route
    const backendUrl = getBackendUrl();
    console.log('[Signup OAuth] Using backend:', backendUrl);
    window.location.href = `${backendUrl}/auth/${provider}`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Create Account 🚀</h1>
          <p>Join us to start detecting potholes</p>
        </div>

        {/* Alert Message */}
        {alertMessage && (
          <div className={`${styles.alert} ${
            alertType === 'success' ? styles.success : 
            alertType === 'warning' ? styles.warning : 
            styles.error
          }`}>
            {alertMessage}
          </div>
        )}

        {/* Email Deliverability Notice */}
        <div className={styles.spamNotice}>
          <div className={styles.spamIcon}>📧</div>
          <div className={styles.spamContent}>
            <h3>Check your spam folder!</h3>
            <p>
              Our verification emails may land in <strong>Spam</strong> or <strong>Promotions</strong>.
              Mark us as safe to ensure smooth communication!
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (
            <span className={styles.loadingText}>
              <span className={styles.spinner}></span>
              Creating Account...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <div className={styles.oauthButtons}>
        <button 
          onClick={() => handleOAuthSignup('google')} 
          className={`${styles.oauthButton} ${styles.googleButton}`}
          type="button"
        >
          <svg className={styles.oauthIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <button 
          onClick={() => handleOAuthSignup('microsoft')} 
          className={`${styles.oauthButton} ${styles.microsoftButton}`}
          type="button"
        >
          <svg className={styles.oauthIcon} viewBox="0 0 24 24">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M13 1h10v10H13z"/>
            <path fill="#7fba00" d="M1 13h10v10H1z"/>
            <path fill="#ffb900" d="M13 13h10v10H13z"/>
          </svg>
          Continue with Microsoft
        </button>
      </div>

        {/* Login Link */}
        <div className={styles.linkContainer}>
          <a href="/login" className={styles.link}>
            Already have an account? <strong>Log in</strong>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;