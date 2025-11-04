import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AuthPageNew.module.css';

const OAuthCallbackPage = ({ setIsLoggedIn }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const name = searchParams.get('name');
      const email = searchParams.get('email');

      if (token) {
        // Store token and user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify({
          name: decodeURIComponent(name || ''),
          email: decodeURIComponent(email || ''),
          authProvider: provider,
          verified: true
        }));

        setIsLoggedIn(true);
        setStatus('success');

        // Redirect to pothole detection page
        setTimeout(() => {
          navigate('/pothole');
        }, 2000);
      } else {
        // OAuth failed
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=oauth_failed');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setIsLoggedIn]);

  return (
    <div className={styles.container}>
      <div className={styles.callbackContainer}>
        {status === 'processing' && (
          <>
            <div className={styles.loadingSpinner}></div>
            <h2>Processing your login...</h2>
            <p>Please wait while we complete your authentication.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.successIcon}>✅</div>
            <h2>Login Successful!</h2>
            <p>Redirecting you to the app...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.errorIcon}>❌</div>
            <h2>Authentication Failed</h2>
            <p>Redirecting you back to login...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
