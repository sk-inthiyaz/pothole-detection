const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image upload and forward to Flask backend
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    // Forward the file to Flask backend
    const response = await axios.post('http://127.0.0.1:7000/process', formData, {
      headers: formData.getHeaders(),
    });

    // Send the response from Flask back to React
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image', details: error.message });
  }
});

module.exports = router;
