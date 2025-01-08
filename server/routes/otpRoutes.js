// routes/otpRoutes.js

const express = require('express');
const OTPVerification = require('../utils/otpVerification'); // Updated import
const sendOTPVerificationEmail = require('../utils/sendOTPVerificationEmail'); // Email sending utility

const router = express.Router();

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOTP(); // Generate OTP
    const expiresInSeconds = 300; // Set OTP expiry time (5 minutes)

    try {
        // Store OTP in Redis
        await OTPVerification.createOTP(email, otp, expiresInSeconds);

        // Send OTP email
        await sendOTPVerificationEmail({ email, otp });

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const isValid = await OTPVerification.verifyOTP(email, otp);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error verifying OTP' });
    }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = router;
