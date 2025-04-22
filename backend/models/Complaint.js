

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  location: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
