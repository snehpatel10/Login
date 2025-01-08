import React from 'react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'John Doe', email: 'john@example.com' };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto mt-4">
      <h2 className="text-2xl font-extrabold text-purple-600 mb-4">Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-gray-700">Name:</div>
          <div className="text-lg text-gray-900">{user.name}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-gray-700">Email:</div>
          <div className="text-lg text-gray-900">{user.email}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
