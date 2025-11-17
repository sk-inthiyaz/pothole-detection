import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AuthPageNew.module.css';
import { getBackendUrl } from '../utils/api';

const VerifyOTPPage = ({ setIsLoggedIn }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      // Auto-focus first input
      setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
    } else {
      setAlertMessage('No email provided. Redirecting to signup...');
      setAlertType('error');
      setTimeout(() => navigate('/signup'), 2000);
    }
  }, [searchParams, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus on the last filled input or the next empty one
      const nextIndex = Math.min(index + pastedData.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }

    // Handle single character input
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input on backspace if current is empty
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage('');

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setAlertMessage('Please enter all 6 digits of the OTP.');
      setAlertType('error');
      setLoading(false);
      return;
    }

    try {
      const backendUrl = getBackendUrl();
      console.log('[Verify OTP] Using backend:', backendUrl);
      const response = await fetch(`${backendUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const result = await response.json();

      if (response.ok) {
        const { token, user } = result;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setAlertMessage('✅ Email verified successfully! Redirecting...');
        setAlertType('success');
        setTimeout(() => {
          navigate('/pothole');
        }, 1500);
      } else {
        setAlertMessage(result.error || 'Invalid OTP. Please try again.');
        setAlertType('error');
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      setAlertMessage('Error verifying OTP. Please try again.');
      setAlertType('error');
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setAlertMessage('');

    try {
      const backendUrl = getBackendUrl();
      console.log('[Resend OTP] Using backend:', backendUrl);
      const response = await fetch(`${backendUrl}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();

      if (response.ok) {
        setAlertMessage('✅ New OTP sent! Please check your email.');
        setAlertType('success');
        setCountdown(60); // 60 seconds cooldown
        setOtp(['', '', '', '', '', '']); // Clear inputs
        document.getElementById('otp-0')?.focus();
      } else {
        setAlertMessage(result.error || 'Failed to resend OTP.');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('Error resending OTP. Please try again.');
      setAlertType('error');
      console.error('Error resending OTP:', error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Verify Your Email 📧</h1>
          <p>Enter the 6-digit code sent to</p>
          <p className={styles.emailDisplay}>{email}</p>
        </div>

        {/* Spam Warning Banner */}
        <div className={styles.spamNotice}>
          <div className={styles.spamIcon}>📬</div>
          <div className={styles.spamContent}>
            <h3>Can't find the email?</h3>
            <p>
              Your verification code may be in your <strong>Spam</strong> or <strong>Junk</strong> folder.
              Please check there and mark us as <strong>Not Spam</strong> to receive future emails directly in your inbox.
            </p>
            <div className={styles.spamTip}>
              💡 Add <strong>no-reply@mydomain.com</strong> to your contacts for better delivery
            </div>
          </div>
        </div>

        {alertMessage && (
          <div className={`${styles.alert} ${
            alertType === 'success' ? styles.success : styles.error
          }`}>
            {alertMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpLabel}>
            <label>Enter OTP Code</label>
          </div>
          
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
                disabled={loading}
              />
            ))}
          </div>

          <button type="submit" className={styles.button} disabled={loading || otp.join('').length !== 6}>
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className={styles.resendContainer}>
          <p>Didn't receive the code?</p>
          {countdown > 0 ? (
            <span className={styles.countdown}>Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className={styles.resendButton}
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <div className={styles.linkContainer}>
          <a href="/login" className={styles.link}>
            Back to <strong>Login</strong>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
