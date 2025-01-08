require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.AUTH_EMAIL, // Loaded from .env
        pass: process.env.AUTH_PASSWORD, // Loaded from .env
    },
});

// Test Transporter Connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter Error:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});
