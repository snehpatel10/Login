
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.AUTH_EMAIL, // Loaded from .env
        pass: process.env.AUTH_PASSWORD, // Loaded from .env
    },
});

// Send OTP Email function
async function sendOTPVerificationEmail({ email, otp }) {
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Your OTP Code', // Subject line
        text: `Your OTP code is: ${otp}`, // plain text body
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`, // html body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to: ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}

module.exports = sendOTPVerificationEmail;
