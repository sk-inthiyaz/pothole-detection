const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { 
        // Password is required only for local auth (not OAuth)
        return this.authProvider === 'local';
    }},
    
    // Email verification fields
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    
    // OAuth fields
    googleId: { type: String, sparse: true, unique: true },
    microsoftId: { type: String, sparse: true, unique: true },
    authProvider: { 
        type: String, 
        enum: ['local', 'google', 'microsoft'], 
        default: 'local' 
    },
    
    // Additional profile fields
    profilePicture: { type: String },
    
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('User', userSchema);
