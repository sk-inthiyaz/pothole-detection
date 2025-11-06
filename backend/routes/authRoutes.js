const express = require('express');
const User = require('../models/User');
const OTP = require('../models/OTP');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');
require('../config/loadEnv');

// Sign up route with OTP verification
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    console.log('[SIGNUP] Incoming:', { name, email: email && String(email).toLowerCase(), hasPassword: !!password });

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check for existing user
  const existing = await User.findOne({ email });
  console.log('[SIGNUP] Existing user?', !!existing, existing?.verified ? 'verified' : 'not-verified');
    if (existing) {
      if (existing.verified) {
        return res.status(409).json({ error: 'Email already registered and verified.' });
      } else {
        // User exists but not verified - allow resending OTP
        return res.status(409).json({ 
          error: 'Email already registered but not verified. Please verify your email or request a new OTP.',
          needsVerification: true 
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (unverified)
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      authProvider: 'local',
      verified: false 
    });
  await newUser.save();
  console.log('[SIGNUP] User saved:', newUser._id);

    // Generate and send OTP
    const otp = generateOTP();
    if (String(process.env.LOG_OTP || 'false') === 'true') {
      console.warn(`[DEV ONLY] OTP for ${email}: ${otp}`);
    }
    
    // Save OTP to database
  await OTP.create({ email, otp });
  console.log('[SIGNUP] OTP stored');

    // Send OTP email
    try {
      console.log('[SIGNUP] Sending OTP email via provider...');
      await sendOTPEmail(email, otp, name);
      console.log('[SIGNUP] OTP email sent');
      return res.status(201).json({ 
        message: 'User registered successfully! Please check your email for OTP verification.',
        email: email,
        requiresVerification: true
      });
    } catch (emailError) {
      console.error('[SIGNUP] Error sending OTP email:', emailError?.message || emailError);
      // Delete the user if email fails
      await User.deleteOne({ email });
      console.log('[SIGNUP] Rolled back user due to email failure:', email);
      return res.status(500).json({ 
        error: 'Failed to send verification email. Please try again.' 
      });
    }

  } catch (error) {
    console.error('[SIGNUP] Error registering user:', error?.message || error);
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid input.', details: error.message });
    }
    return res.status(500).json({ error: 'Error registering user' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Find user and mark as verified
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Email already verified.' });
    }

    // Update user verification status
    user.verified = true;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ email, otp });

    // Send welcome email
    await sendWelcomeEmail(email, user.name);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({ 
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Error verifying OTP' });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Email already verified.' });
    }

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save new OTP
    await OTP.create({ email, otp });

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    return res.status(200).json({ 
      message: 'New OTP sent successfully! Please check your email.' 
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ error: 'Error resending OTP' });
  }
});

// Login route (updated to check verification)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user signed up with OAuth
    if (user.authProvider !== 'local') {
      return res.status(400).json({ 
        error: `This account was created using ${user.authProvider}. Please use ${user.authProvider} login.` 
      });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: email
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(200).json({ 
      message: 'Login successful!', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        authProvider: user.authProvider,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
