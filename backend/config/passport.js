const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');
require('dotenv').config();

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // User exists, return user
            return done(null, user);
        }

        // Check if user exists with same email (from local auth)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.verified = true; // Google accounts are pre-verified
            user.profilePicture = profile.photos[0]?.value;
            await user.save();
            return done(null, user);
        }

        // Create new user
        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            authProvider: 'google',
            verified: true, // Google accounts are pre-verified
            profilePicture: profile.photos[0]?.value
        });

        await user.save();
        done(null, user);
    } catch (error) {
        console.error('Error in Google OAuth:', error);
        done(error, null);
    }
}));

// Microsoft OAuth Strategy (Optional - only if credentials are provided)
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:5001/auth/microsoft/callback',
        scope: ['user.read']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with Microsoft ID
            let user = await User.findOne({ microsoftId: profile.id });

            if (user) {
                // User exists, return user
                return done(null, user);
            }

            // Check if user exists with same email (from local auth)
            const email = profile.emails?.[0]?.value || profile._json?.userPrincipalName;
            user = await User.findOne({ email });

            if (user) {
                // Link Microsoft account to existing user
                user.microsoftId = profile.id;
                user.authProvider = 'microsoft';
                user.verified = true; // Microsoft accounts are pre-verified
                await user.save();
                return done(null, user);
            }

            // Create new user
            user = new User({
                microsoftId: profile.id,
                name: profile.displayName,
                email: email,
                authProvider: 'microsoft',
                verified: true // Microsoft accounts are pre-verified
            });

            await user.save();
            done(null, user);
        } catch (error) {
            console.error('Error in Microsoft OAuth:', error);
            done(error, null);
        }
    }));
} else {
    console.log('⚠️ Microsoft OAuth not configured - skipping');
}

module.exports = passport;
