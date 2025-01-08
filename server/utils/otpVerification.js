const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URI,
});

// Connect to Redis
client.connect().catch(console.error);

// OTP Utility
const OTPVerification = {
    async createOTP(email, otp, expiresInSeconds = 300) {
        const key = `otp:${email}`;
        await client.setEx(key, expiresInSeconds, otp);
    },

    async verifyOTP(email, otp) {
        const key = `otp:${email}`;
        const storedOtp = await client.get(key);

        if (!storedOtp) return false; // OTP expired or not found
        if (storedOtp === otp) {
            await client.del(key); // Delete OTP after successful verification
            return true;
        }
        return false; // Invalid OTP
    },
};

module.exports = OTPVerification;
