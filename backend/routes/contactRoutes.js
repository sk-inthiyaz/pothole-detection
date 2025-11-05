const express = require('express');
const router = express.Router();
const { transporter } = require('../services/emailService');

// POST /api/contact
// Body: { name, email, message }
router.post('/', async (req, res) => {
	try {
		const { name, email, message } = req.body || {};

		if (!name || !email || !message) {
			return res.status(400).json({ error: 'Name, email, and message are required.' });
		}

		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: 'Invalid email format.' });
		}

		const toEmail = process.env.CONTACT_TO_EMAIL || process.env.EMAIL_USER;
		if (!toEmail) {
			return res.status(500).json({ error: 'Email service not configured. CONTACT_TO_EMAIL or EMAIL_USER missing.' });
		}

		const mailOptions = {
			from: `Pothole Detection Contact <${process.env.EMAIL_USER || 'no-reply@example.com'}>`,
			to: toEmail,
			subject: `📩 New Contact Message from ${name}`,
			replyTo: email,
			html: `
				<div style="font-family:Segoe UI,Arial,sans-serif;">
					<h2>New Contact Message</h2>
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> ${email}</p>
					<p><strong>Message:</strong></p>
					<div style="white-space:pre-wrap;border-left:4px solid #667eea;padding:12px;background:#f8f9ff;">${message}</div>
					<hr />
					<p style="font-size:12px;color:#666;">This email was sent from the Contact Us form.</p>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return res.status(200).json({ message: 'Message sent successfully!' });
	} catch (err) {
		console.error('Contact form error:', err);
		return res.status(500).json({ error: 'Failed to send message.' });
	}
});

module.exports = router;

