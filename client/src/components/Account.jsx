import React, { useState, useEffect } from 'react';

function Account() {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [filePreview, setFilePreview] = useState('');

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
      } else {
        const errorData = await response.json();
        console.error('Failed to save changes:', errorData.message);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-800 to-indigo-900 p-6">
      <div className="bg-[#1a202c] bg-opacity-90 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-xl border-2 border-indigo-600">
        <h2 className="text-3xl font-semibold text-gray-200 text-center mb-6">Account Settings</h2>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative w-36 h-36 border-4 border-indigo-500 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
              {/* Show Cloudinary image URL after successful upload */}
              {user.profilePic && typeof user.profilePic === 'string' ? (
                <img
                  src={user.profilePic || defaultProfilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : filePreview ? (
                // Show local preview before uploading
                <img
                  src={filePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 font-semibold">
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
            <div className="text-sm text-center text-gray-500">
              {user.profilePic || filePreview ? (
                <button
                  onClick={handleRemoveProfilePic}
                  className="mt-2 text-red-500 hover:text-red-700 transition duration-200"
                >
                  Remove Profile Picture
                </button>
              ) : (
                <p className="text-gray-500">Click to upload a new profile picture</p>
              )}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-200">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-indigo-500 rounded-lg bg-indigo-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              />
            ) : (
              <div className="mt-2 text-lg text-gray-200">{user.name}</div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-200">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-indigo-500 rounded-lg bg-indigo-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
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
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
