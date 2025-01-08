const express = require('express');
const cors = require('cors');
const moment = require('moment');
const dotenv = require('dotenv');
const connectDB = require('./db/config'); // MongoDB connection
const User = require('./db/users'); // User model
const otpRoutes = require('./routes/otpRoutes'); // OTP Routes
const { uploadOnCloudinary, deleteFileFromDisk } = require('./utils/cloudinary'); // Cloudinary upload function
const { upload } = require('./middleware/multer.middleware');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// User Registration
app.post('/register', async (req, res) => {
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use. Please use a different email.' });
        }

        // Create a new user if no duplicates are found
        const user = new User(req.body);

        // Save the user to the database
        await user.save();

        // Exclude the password before sending the response
        const result = user.toObject();
        delete result.password;

        // Return success response with user data
        return res.status(201).json({ success: true, user: result }); // Send success as true
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(400).json({ success: false, message: 'An error occurred during registration.' });
    }
});


// User Login
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password }).select('-password');
        if (user) {
            res.send(user);
        } else {
            res.status(400).send('User not found');
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// OTP Routes
app.use('/api/otp', otpRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/api/otp/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    try {
        // Find OTP record by email
        const otpRecord = await OTPVerification.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'No OTP record found for this email.' });
        }

        // Check if OTP matches
        const isOtpValid = otpRecord.otp === otp;
        const isOtpExpired = moment().isAfter(moment(otpRecord.expiresAt));

        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        if (isOtpExpired) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // OTP is valid, proceed to the next step (e.g., allow password reset)
        return res.status(200).json({ success: true, message: 'OTP verified successfully.' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while verifying OTP.' });
    }
});

app.post('/api/otp/reset-password', async (req, res) => {
    const { email, password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.password = password; // Update with the new password
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ success: false, message: 'Error resetting password' });
    }
});

app.post('/api/update-profile', upload.single('profilePic'), async (req, res) => {
    const { name, email } = req.body;
    const { file } = req; // The uploaded file

    try {
        let profilePicUrl = '';

        // If a new profile picture is uploaded
        if (file) {
            const uploadResult = await uploadOnCloudinary(file.path); // Call Cloudinary upload
            if (uploadResult && uploadResult.secure_url) {
                profilePicUrl = uploadResult.secure_url; // Get Cloudinary URL
                deleteFileFromDisk(file.path); // Delete local file after upload
            } else {
                return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary' });
            }
        }

        // Find and update user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePicUrl || user.profilePic; // Only update profilePic if new one exists

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password; // Don't send password in response

        return res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ success: false, message: 'Error updating profile' });
    }
});
