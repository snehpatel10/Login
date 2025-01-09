const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary credentials are missing in environment variables.');
  process.exit(1) // Stop the application if Cloudinary credentials are missing
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload the image to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null; // Ensure that the file path is provided

    // Upload the image to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Auto-detect file type (image, video, etc.)
    });

    // Log response if successful
//    console.log('File uploaded successfully to Cloudinary:', response);

    // Return the Cloudinary response containing image info
    return {
      secure_url: response.secure_url, // Cloudinary URL for the image
      public_id: response.public_id, // Public ID if needed for future reference
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Delete the file from disk after failure
      console.log('Failed upload, file deleted from disk:', localFilePath);
    }
    return null;
  }
};

// Function to delete file from disk after upload
const deleteFileFromDisk = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file from disk
      console.log('File deleted from disk:', filePath);
    } else {
      console.log('File not found for deletion:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file from disk:', error);
  }
};

module.exports = { uploadOnCloudinary, deleteFileFromDisk };
