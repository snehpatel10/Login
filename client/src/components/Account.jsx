import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Account() {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [filePreview, setFilePreview] = useState('');
  const [showToast, setShowToast] = useState(false); // To control toast visibility
  const [isSaving, setIsSaving] = useState(false); // To track loading state

  const defaultProfilePic = 'https://path-to-your-default-image.jpg'; // Default image URL

  // Handle changes to the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle file input for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        profilePic: file, // Save the file itself to the state for upload
      }));

      // Preview the image before upload
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Save changes to the user profile
  const handleSave = async () => {
    setIsSaving(true); // Start loading

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);

    // If a new profile picture is selected, append it
    if (user.profilePic && typeof user.profilePic === 'object') {
      formData.append('profilePic', user.profilePic); // Send file to backend
    }

    try {
      const response = await fetch('http://localhost:3000/api/update-profile', {
        method: 'POST', // Ensure you use POST, not PUT
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // After upload, update the profile picture URL with Cloudinary URL
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: data.user.profilePic, // Cloudinary URL returned from API
        }));

        // Save updated data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        setFilePreview(''); // Clear the file preview
        setIsEditing(false); // Exit editing mode

        toast.success('Profile updated successfully');

      } else {
        const errorData = await response.json();
        console.error('Failed to save changes:', errorData.message);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  // Remove profile picture
  const handleRemoveProfilePic = () => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePic: '', // Remove the profile picture URL or file
    }));
    setFilePreview(''); // Reset the file preview
  };

  return (
    <div className="bg-gradient-to-r from-[#1E1E2F] to-[#3A2B4A] min-h-screen py-6 flex justify-center items-center">
      {/* Account Settings Card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg bg-[#2A2B3C] border-2 border-teal-500">
        <h2 className="text-3xl font-extrabold text-teal-400 text-center mb-6">Account Settings</h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 border-4 border-teal-600 rounded-full overflow-hidden shadow-lg bg-[#333548] transform hover:scale-105 transition duration-300">
            {user.profilePic && typeof user.profilePic === 'string' ? (
              <img
                src={user.profilePic || defaultProfilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : filePreview ? (
              <img
                src={filePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300 font-semibold">
                No Image
              </div>
            )}

            {isEditing && (
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
        </div>

        {isEditing && (
          <div className="text-sm text-center text-gray-400">
            {user.profilePic || filePreview ? (
              <button
                onClick={handleRemoveProfilePic}
                className="mt-0 text-red-500 hover:text-red-700 transition duration-200"
              >
                Remove Profile Picture
              </button>
            ) : (
              <p className="text-gray-500">Click to upload a new profile picture</p>
            )}
          </div>
        )}

        {/* Full Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-md font-medium text-gray-200">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-teal-500 rounded-lg bg-[#3C3D4A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-600 transition duration-200"
            />
          ) : (
            <div className="mt-2 text-lg text-gray-200">{user.name}</div>
          )}
        </div>

        {/* Email Address Field */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-md font-medium text-gray-200">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-2 p-3 w-full border border-teal-500 rounded-lg bg-[#3C3D4A] text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-600 transition duration-200"
            />
          ) : (
            <div className="mt-2 text-lg text-gray-200">{user.email}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-300 transform active:scale-95 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      d="M4 12a8 8 0 0116 0"
                    ></path>
                  </svg>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        <Toaster />
        
      </div>
    </div>
  );
}

export default Account;
