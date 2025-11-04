
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendPotholeComplaintEmail } = require('../services/emailService');

// Submit pothole complaint with email notification
router.post('/', async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    console.log("💥 Complaint received:", req.body);
  }

  const { location, description } = req.body;

  // Validate required fields
  if (!location || !description) {
    return res.status(400).json({ message: 'Location and description are required.' });
  }

  // Resolve current user from session (Passport) or JWT (Authorization header)
  let currentUser = null;
  try {
    if (req.user) {
      // Passport session user (OAuth logins)
      currentUser = req.user;
    } else if (req.headers && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const [scheme, token] = authHeader.split(' ');
      if (scheme === 'Bearer' && token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.userId) {
          currentUser = await User.findById(decoded.userId).lean();
        }
      }
    }
  } catch (authErr) {
    // Don't block complaint on auth errors; just proceed without email notification
    if (!isProd) {
      console.warn('⚠️ Unable to resolve current user for complaint:', authErr.message);
    }
  }

  try {
    // Save complaint to database with optional user info
    const newComplaint = new Complaint({
      location,
      description,
      userEmail: currentUser?.email || null,
      userName: currentUser?.name || null,
      status: 'pending'
    });

    await newComplaint.save();
    
    if (!isProd) {
      console.log("✓ Complaint saved to database");
    }

    // Send confirmation email if we have a resolved user email
    if (currentUser?.email) {
      try {
        await sendPotholeComplaintEmail(
          currentUser.email,
          currentUser.name || 'Valued Citizen',
          location,
          description
        );
        
        if (!isProd) {
          console.log("✓ Confirmation email sent to:", currentUser.email);
        }
      } catch (emailError) {
        if (!isProd) {
          console.error("⚠️ Warning: Email failed but complaint saved:", emailError.message);
        }
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      message: 'Complaint submitted successfully!'+ (currentUser?.email ? ' Check your email for confirmation.' : ''),
      complaintId: newComplaint._id
    });

  } catch (err) {
    if (isProd) {
      console.error("Error saving complaint:", err.message);
    } else {
      console.error("❌ Error saving complaint:", err);
    }
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
});

// Get all complaints (optional - for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    const isProd = process.env.NODE_ENV === 'production';
    
    if (isProd) {
      console.error("Error fetching complaints:", err.message);
    } else {
      console.error("❌ Error fetching complaints:", err);
    }
    
    res.status(500).json({ message: 'Failed to fetch complaints.' });
  }
});

module.exports = router;
