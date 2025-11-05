const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with Gmail using explicit port 587 (TLS)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS (not SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

// Test transporter configuration
transporter.verify((error, success) => {
    const isProd = process.env.NODE_ENV === 'production';
    
    if (error) {
        console.error('Email service configuration error:', error);
    } else {
        if (!isProd) {
            console.log('✓ Email service is ready');
        }
    }
});

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP verification email
 */
const sendOTPEmail = async (email, otp, name) => {
    const mailOptions = {
        from: `"Pothole Detection" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Verify Your Email - Pothole Detection',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 16px;
                        color: #666;
                        line-height: 1.6;
                        margin-bottom: 30px;
                    }
                    .otp-box {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-size: 36px;
                        font-weight: 800;
                        letter-spacing: 8px;
                        text-align: center;
                        padding: 25px;
                        border-radius: 15px;
                        margin: 30px 0;
                        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                    }
                    .warning {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                        font-size: 14px;
                        color: #856404;
                    }
                    .footer {
                        text-align: center;
                        padding: 30px;
                        color: #999;
                        font-size: 14px;
                        border-top: 1px solid #eee;
                    }
                    .footer a {
                        color: #667eea;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛣️ Pothole Detection</h1>
                    </div>
                    <div class="content">
                        <div class="greeting">
                            Hello ${name || 'User'}! 👋
                        </div>
                        <div class="message">
                            Thank you for signing up! To complete your registration and verify your email address, 
                            please use the One-Time Password (OTP) below:
                        </div>
                        <div class="otp-box">
                            ${otp}
                        </div>
                        <div class="message">
                            This OTP is valid for <strong>10 minutes</strong>. Enter it on the verification page 
                            to activate your account.
                        </div>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. 
                            Our team will never ask for your OTP via phone or email.
                        </div>
                    </div>
                    <div class="footer">
                        <p>
                            If you didn't request this verification, please ignore this email or 
                            <a href="#">contact support</a>.
                        </p>
                        <p>
                            &copy; ${new Date().getFullYear()} Pothole Detection. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        const isProd = process.env.NODE_ENV === 'production';
        
        if (!isProd) {
            console.log('✓ OTP email sent:', info.messageId);
        }
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Error sending OTP email:', error.message || error);
        throw error;
    }
};

/**
 * Send welcome email after successful verification
 */
const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: `"Pothole Detection" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎉 Welcome to Pothole Detection!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .success-icon {
                        font-size: 80px;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 18px;
                        color: #333;
                        line-height: 1.8;
                        margin: 20px 0;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        border-radius: 30px;
                        text-decoration: none;
                        font-weight: 600;
                        margin: 30px 0;
                        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                    }
                    .features {
                        text-align: left;
                        margin: 30px 0;
                    }
                    .feature {
                        margin: 15px 0;
                        font-size: 16px;
                        color: #666;
                    }
                    .footer {
                        text-align: center;
                        padding: 30px;
                        color: #999;
                        font-size: 14px;
                        border-top: 1px solid #eee;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome Aboard! 🎉</h1>
                    </div>
                    <div class="content">
                        <div class="success-icon">✅</div>
                        <div class="message">
                            <strong>Hi ${name}!</strong><br><br>
                            Your email has been successfully verified! You're now part of the Pothole Detection community.
                        </div>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="cta-button">
                            Start Detecting Potholes
                        </a>
                        <div class="features">
                            <div class="feature">📸 Upload road images for instant pothole detection</div>
                            <div class="feature">🤖 AI-powered analysis with confidence scores</div>
                            <div class="feature">📝 Report potholes to help improve road safety</div>
                            <div class="feature">🎯 Track your contributions and make a difference</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
                        <p>&copy; ${new Date().getFullYear()} Pothole Detection. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        const isProd = process.env.NODE_ENV === 'production';
        
        if (!isProd) {
            console.log('✓ Welcome email sent:', info.messageId);
        }
        
        return { success: true };
    } catch (error) {
        console.error('✗ Error sending welcome email:', error.message || error);
        // Don't throw error for welcome email - it's not critical
        return { success: false };
    }
};

/**
 * Send Pothole Complaint Confirmation Email
 */
const sendPotholeComplaintEmail = async (email, name, location, description) => {
    const mailOptions = {
        from: `"Pothole Detection Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Pothole Report Received - We\'re On It!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .icon {
                        font-size: 64px;
                        margin: 20px 0;
                    }
                    .content {
                        padding: 40px 30px;
                        color: #333;
                    }
                    .message {
                        font-size: 16px;
                        line-height: 1.8;
                        margin-bottom: 30px;
                    }
                    .details-box {
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        border-left: 4px solid #667eea;
                        padding: 20px;
                        border-radius: 10px;
                        margin: 25px 0;
                    }
                    .details-box strong {
                        color: #667eea;
                        font-size: 14px;
                        text-transform: uppercase;
                        display: block;
                        margin-bottom: 8px;
                    }
                    .details-box p {
                        margin: 5px 0;
                        font-size: 15px;
                        color: #2d3748;
                    }
                    .timeline {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 12px;
                        margin: 25px 0;
                    }
                    .timeline h3 {
                        color: #667eea;
                        margin-top: 0;
                        font-size: 18px;
                    }
                    .timeline-step {
                        display: flex;
                        align-items: center;
                        margin: 15px 0;
                        padding-left: 10px;
                    }
                    .timeline-step:before {
                        content: "✓";
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;
                        font-weight: bold;
                        font-size: 14px;
                    }
                    .policies {
                        background: #fff3cd;
                        border: 2px solid #ffc107;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 25px 0;
                    }
                    .policies h3 {
                        color: #856404;
                        margin-top: 0;
                        font-size: 16px;
                    }
                    .policies ul {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    .policies li {
                        color: #856404;
                        margin: 8px 0;
                        font-size: 14px;
                    }
                    .wishes {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 25px;
                        border-radius: 12px;
                        text-align: center;
                        margin: 25px 0;
                    }
                    .wishes h3 {
                        margin-top: 0;
                        font-size: 20px;
                    }
                    .wishes p {
                        font-size: 15px;
                        line-height: 1.6;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 14px 32px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                        transition: transform 0.3s ease;
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
                    }
                    .footer {
                        background: #f8f9fa;
                        padding: 25px 30px;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    }
                    .footer a {
                        color: #667eea;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">🛣️</div>
                        <h1>Thank You for Reporting!</h1>
                    </div>
                    <div class="content">
                        <div class="message">
                            <strong>Dear ${name || 'Valued Citizen'},</strong><br><br>
                            We have successfully received your pothole report. Your contribution helps us make roads safer for everyone! 🚗💨
                        </div>

                        <div class="details-box">
                            <strong>📍 Report Details</strong>
                            <p><strong>Location:</strong> ${location}</p>
                            <p><strong>Description:</strong> ${description}</p>
                            <p><strong>Reported On:</strong> ${new Date().toLocaleString('en-IN', { 
                                dateStyle: 'full', 
                                timeStyle: 'short',
                                timeZone: 'Asia/Kolkata' 
                            })}</p>
                        </div>

                        <div class="timeline">
                            <h3>🔄 What Happens Next?</h3>
                            <div class="timeline-step">Report received and logged in our system</div>
                            <div class="timeline-step">Our team will verify the location within 24-48 hours</div>
                            <div class="timeline-step">Repair crew will be dispatched to the site</div>
                            <div class="timeline-step">Pothole will be fixed as per priority and weather conditions</div>
                        </div>

                        <div class="policies">
                            <h3>📋 Our Policies & Commitments</h3>
                            <ul>
                                <li><strong>Response Time:</strong> We aim to address reported potholes within 7-15 business days depending on severity and weather conditions.</li>
                                <li><strong>Priority System:</strong> High-traffic areas and safety hazards are given priority.</li>
                                <li><strong>Updates:</strong> You may receive updates if we need additional information.</li>
                                <li><strong>Privacy:</strong> Your contact information is kept confidential and used only for this report.</li>
                                <li><strong>Follow-up:</strong> Feel free to check the status of your report anytime.</li>
                            </ul>
                        </div>

                        <div class="wishes">
                            <h3>🌟 Your Safety, Our Priority</h3>
                            <p>Thank you for being a responsible citizen and helping us maintain better roads! Your vigilance makes our community safer for everyone.</p>
                            <p><strong>Drive safely and stay aware! 🚦</strong></p>
                            <p style="font-size: 14px; margin-top: 15px;">Together, we're building safer roads, one report at a time. 💪</p>
                        </div>

                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:7001'}/pothole" class="cta-button">
                                Report Another Pothole
                            </a>
                        </center>
                    </div>
                    <div class="footer">
                        <p><strong>Pothole Detection System</strong></p>
                        <p>Need help or have questions? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
                        <p style="margin-top: 15px; font-size: 12px;">&copy; ${new Date().getFullYear()} Pothole Detection. All rights reserved.</p>
                        <p style="font-size: 12px; color: #999;">This is an automated confirmation email. Please do not reply directly.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        const isProd = process.env.NODE_ENV === 'production';
        
        if (!isProd) {
            console.log('✓ Pothole complaint confirmation email sent:', info.messageId);
        }
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('✗ Error sending pothole complaint email:', error.message || error);
        throw error;
    }
};

module.exports = {
    generateOTP,
    sendOTPEmail,
    sendWelcomeEmail,
    sendPotholeComplaintEmail,
    // Export transporter for reuse (e.g., contact form)
    transporter
};
