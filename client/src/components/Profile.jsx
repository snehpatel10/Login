import React from 'react';

function Profile() {
  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'John Doe', email: 'john@example.com', avatar: '' };

  return (
    <div className="bg-gradient-to-r from-[#1E1E2F] to-[#3A2B4A] min-h-screen py-10">
      {/* Profile Card */}
      <div className="max-w-lg mx-auto p-8 sm:p-10 rounded-2xl shadow-2xl bg-[#28293D]">
        {/* Profile Heading */}
        <h2 className="text-3xl font-extrabold text-teal-400 mb-8 text-center">Your Profile</h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={user.profilePic || '/default-avatar.png'} // Default avatar if none is found
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-400 shadow-xl"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-gray-300">
            <div className="font-semibold">Name:</div>
            <div className="text-lg text-gray-200">{user.name}</div>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <div className="font-semibold">Email:</div>
            <div className="text-lg text-gray-200">{user.email}</div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8 text-center">
          <button
            className="px-6 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-medium text-gray-100 shadow-md transition duration-200 ease-in-out"
            onClick={() => alert('Redirect to profile editing page (if any)')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
