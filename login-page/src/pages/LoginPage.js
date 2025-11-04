import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AuthPageNew.module.css';

const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      setAlertMessage('OAuth authentication failed. Please try again.');
      setAlertType('error');
    } else if (error === 'token_generation_failed') {
      setAlertMessage('Failed to generate authentication token. Please try again.');
      setAlertType('error');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage('');
    console.log('Form submitted with:', { email, password });

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log('Response from backend:', result);

      if (response.ok) {
        const { token, user } = result;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setAlertMessage('Login successful! Redirecting...');
        setAlertType('success');
        setTimeout(() => {
          navigate('/pothole');
        }, 1500);
      } else {
        // Check if user needs email verification
        if (result.needsVerification) {
          setNeedsVerification(true);
          setAlertMessage(result.error || 'Please verify your email before logging in.');
          setAlertType('warning');
        } else {
          setAlertMessage(result.error || 'Login failed');
          setAlertType('error');
        }
      }
    } catch (error) {
      setAlertMessage('Error logging in. Please try again.');
      setAlertType('error');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    // Redirect to backend OAuth route
    window.location.href = `http://localhost:5001/auth/${provider}`;
  };

  const handleVerifyEmail = () => {
    // Navigate to OTP verification page with email
    navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Welcome Back! 👋</h1>
          <p>Sign in to continue detecting potholes</p>
        </div>

        {alertMessage && (
          <div className={`${styles.alert} ${
            alertType === 'success' ? styles.success : 
            alertType === 'warning' ? styles.warning : 
            styles.error
          }`}>
            {alertMessage}
            {needsVerification && (
              <button 
                onClick={handleVerifyEmail} 
                className={styles.verifyButton}
                type="button"
              >
                Verify Email Now
              </button>
            )}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div className={styles.oauthButtons}>
          <button 
            onClick={() => handleOAuthLogin('google')} 
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
            onClick={() => handleOAuthLogin('microsoft')} 
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

        <div className={styles.linkContainer}>
          <a href="/signup" className={styles.link}>
            Don't have an account? <strong>Sign up</strong>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
