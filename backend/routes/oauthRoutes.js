const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
require('../config/loadEnv');

// Google OAuth routes
router.get('/auth/google', (req, res, next) => {
    // Check if credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
        return res.status(400).json({ 
            error: 'Google OAuth not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file.',
            details: 'Credentials are missing or using placeholder values'
        });
    }
    // Instrument redirect to inspect the generated Google authorization URL (for debugging scopes/callback)
    const originalRedirect = res.redirect.bind(res);
    res.redirect = (url) => {
        console.log('[OAuth][Google] Redirecting to:', url);
        try {
            const u = new URL(url);
            console.log('[OAuth][Google] Query params:', {
                scope: u.searchParams.get('scope'),
                redirect_uri: u.searchParams.get('redirect_uri'),
                client_id: u.searchParams.get('client_id'),
                response_type: u.searchParams.get('response_type'),
            });
        } catch (e) {
            console.log('[OAuth][Google] Non-URL redirect or parse error');
        }
        return originalRedirect(url);
    };

    passport.authenticate('google', {
        // Required and explicit
        scope: ['profile', 'email'],
        response_type: 'code',
        // Nice-to-have UX and offline refresh tokens
        prompt: 'select_account',
        includeGrantedScopes: true,
        accessType: 'offline',
        // Also pass underscore variants to ensure Google sees them even if lib doesn’t map camelCase
        include_granted_scopes: 'true',
        access_type: 'offline'
    })(req, res, next);
});

router.get('/auth/google/callback',
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`,
        session: true 
    }),
    (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                { userId: req.user._id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Redirect to frontend with token and user data
            const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=google&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;
            
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error in Google OAuth callback:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
        }
    }
);

// Microsoft OAuth routes
router.get('/auth/microsoft',
    passport.authenticate('microsoft', {
        scope: ['user.read']
    })
);

router.get('/auth/microsoft/callback',
    passport.authenticate('microsoft', { 
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`,
        session: true 
    }),
    (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                { userId: req.user._id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Redirect to frontend with token and user data
            const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=microsoft&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;
            
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error in Microsoft OAuth callback:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
        }
    }
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Session destruction failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ message: 'Logged out successfully' });
        });
    });
});

// Get current user route (protected)
router.get('/auth/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                verified: req.user.verified,
                authProvider: req.user.authProvider,
                profilePicture: req.user.profilePicture
            }
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Diagnostic endpoint to check OAuth configuration
router.get('/auth/config-status', (req, res) => {
    const sanitizeBase = (u) => {
        if (!u || typeof u !== 'string') return u;
        const trimmed = u.trim();
        return trimmed.replace(/[\s\n\r]+/g, '').replace(/\/$/, '');
    };
    const inferredBase = `${req.protocol}://${req.get('host')}`;
    const baseBackend = sanitizeBase(
        process.env.BACKEND_URL 
        || process.env.RENDER_EXTERNAL_URL 
        || inferredBase 
        || `http://localhost:${process.env.PORT || 5001}`
    );
    const googleCb = (process.env.NODE_ENV !== 'production' && process.env.GOOGLE_CALLBACK_URL)
        ? process.env.GOOGLE_CALLBACK_URL
        : `${baseBackend}/auth/google/callback`;
    const msCb = (process.env.NODE_ENV !== 'production' && process.env.MICROSOFT_CALLBACK_URL)
        ? process.env.MICROSOFT_CALLBACK_URL
        : `${baseBackend}/auth/microsoft/callback`;
    res.json({
        google: {
            configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here'),
            clientId: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
            callbackUrl: googleCb,
            baseBackend,
            baseBackendEncoded: encodeURI(baseBackend)
        },
        microsoft: {
            configured: !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_ID !== 'your_microsoft_client_id_here'),
            clientId: process.env.MICROSOFT_CLIENT_ID ? '✓ Set' : '✗ Missing',
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
            callbackUrl: msCb
        },
        frontend: {
            url: process.env.FRONTEND_URL || 'http://localhost:3000'
        }
    });
});
        
module.exports = router;
