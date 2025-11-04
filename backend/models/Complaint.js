

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  userEmail: { type: String, required: false }, // User email for notifications
  userName: { type: String, required: false }, // User name
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'resolved'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
