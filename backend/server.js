require('dotenv').config(); // at the top of server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./upload/upload');  // Import the upload routes
const complaintRoutes = require('./routes/complaintRoutes'); // Import the complaint routes


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', authRoutes);
app.use('/upload', uploadRoutes);  // Use the upload routes
app.use('/api/complaints', complaintRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
