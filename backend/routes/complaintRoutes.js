
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// router.post('/', async (req, res) => {
//   const { location, description } = req.body;

//   try {
//     const newComplaint = new Complaint({ location, description });
//     await newComplaint.save();
//     res.status(201).json({ message: 'Complaint submitted successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to submit complaint.' });
//   }
// });
router.post('/', async (req, res) => {
  console.log("💥 Complaint received:", req.body); // Log it

  const { location, description } = req.body;

  try {
    const newComplaint = new Complaint({ location, description });
    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully!' });
  } catch (err) {
    console.error("❌ Error saving complaint:", err);
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
});

module.exports = router;
