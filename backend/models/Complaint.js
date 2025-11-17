

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  userEmail: { type: String, required: false }, // User email for notifications
  userName: { type: String, required: false }, // User name
  imageData: { type: String, required: false }, // Base64 encoded pothole image
  confidence: { type: Number, required: false }, // AI detection confidence
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
