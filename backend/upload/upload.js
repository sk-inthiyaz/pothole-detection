const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Set up multer for file uploads with security restrictions
const storage = multer.memoryStorage();

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG images are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 1 // Only one file per request
  },
  fileFilter: fileFilter
});

// Route to handle image upload and forward to Flask backend
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Additional validation: Check file size again (double-check)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    // Get AI service URL from environment variable (for production deployment)
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:7000';
    const processEndpoint = `${aiServiceUrl}/process`;

    // Forward the file to Flask backend
    const response = await axios.post(processEndpoint, formData, {
      headers: formData.getHeaders(),
      timeout: 30000, // 30 second timeout
    });

    // Send the response from Flask back to React
    res.status(200).json(response.data);
  } catch (error) {
    const isProd = process.env.NODE_ENV === 'production';
    
    if (isProd) {
      console.error('Image processing error:', error.message);
    } else {
      console.error('Error processing image:', error);
    }
    
    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'ML service unavailable. Please try again later.' });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({ error: 'Request timeout. Please try with a smaller image.' });
    }
    
    res.status(500).json({ 
      error: 'Error processing image', 
      message: isProd ? 'Internal server error' : error.message
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Too many files. Only one file is allowed.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

module.exports = router;
