require('./config/loadEnv'); // centralize and conditionally load .env for local only
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const uploadRoutes = require('./upload/upload');  // Import the upload routes
const complaintRoutes = require('./routes/complaintRoutes'); // Import the complaint routes
const contactRoutes = require('./routes/contactRoutes'); // Contact Us route

// Security packages
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');


// Load environment variables
// Already handled by loadEnv; keep dotenv available if needed elsewhere

// Connect to MongoDB
connectDB();

const app = express();

// ============================================
// SECURITY MIDDLEWARE (Apply before routes)
// ============================================

// Trust Render/Proxy headers so req.ip and protocol are correct (needed for rate limit, secure cookies)
app.set('trust proxy', 1);
console.log('✅ Express trust proxy enabled');

// Helmet: Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Needed for some OAuth flows
}));

// NoSQL Injection Protection: Remove $ and . from user inputs
app.use(mongoSanitize({
    replaceWith: '_', // Replace prohibited characters with underscore
}));

// Rate Limiting for Authentication Routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: 'Too many authentication attempts, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    skipFailedRequests: true, // don't penalize network errors
});

// General API Rate Limiter (more permissive)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
});

// CORS configuration - must be before other middleware
// Allow both port 3000 and 7001 for development
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:7001',
    'https://pothole-detection-frontend.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

console.log('🔒 Allowed CORS origins:', allowedOrigins);

// Log incoming Origin header for debugging CORS issues
app.use((req, res, next) => {
    console.log('Incoming Origin:', req.headers.origin || '<none>');
    next();
});

const allowAllOrigins = String(process.env.ALLOW_ALL_ORIGINS || 'false') === 'true';

// Helper: check if origin is allowed (supports *.vercel.app by default)
function isAllowedOrigin(origin) {
    // Allow no-origin requests
    if (!origin) return true;

    // Debug override
    if (allowAllOrigins) return true;

    // Exact allow-list
    if (allowedOrigins.includes(origin)) return true;

    // Suffix allow for Vercel preview/prod domains
    try {
        const { hostname } = new URL(origin);
        if (hostname.endsWith('.vercel.app')) return true;
    } catch (e) {
        // ignore URL parse errors
    }
    return false;
}

app.use(cors({
    origin: function(origin, callback) {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true // Allow cookies and authentication headers
}));

// Body parser middleware (increased limit for base64 images)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware (required for Passport OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'pothole-detection-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiters to specific routes
// Authentication routes (strict limiting)
app.use('/signup', authLimiter);
app.use('/login', authLimiter);
app.use('/verify-otp', authLimiter);
app.use('/resend-otp', authLimiter);

// General API routes (more permissive)
app.use('/api/', apiLimiter);
app.use('/upload', apiLimiter);

// Routes
app.use('/', authRoutes);
app.use('/', oauthRoutes); // OAuth routes (Google, Microsoft)
app.use('/upload', uploadRoutes);  // Use the upload routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/contact', contactRoutes);


const PORT = process.env.PORT || 5001;

// HTTPS redirect for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            return res.redirect(`https://${req.header('host')}${req.url}`);
        }
        next();
    });
}

// Global error handler to return JSON instead of crashing
app.use((err, req, res, next) => {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Don't expose error details in production
    if (isProd) {
        console.error('Production error:', err.message);
        res.status(err.status || 500).json({ 
            error: 'Internal server error',
            message: err.message || 'Something went wrong'
        });
    } else {
        console.error('Development error:', err);
        res.status(err.status || 500).json({ 
            error: 'Internal server error', 
            message: err.message,
            stack: err.stack
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Lightweight health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'backend', port: PORT });
});
