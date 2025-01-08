import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';  // Make sure the Navbar component is properly imported

function HomePage() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600">
      {/* Render Navbar at the top of the page */}
      <Navbar />

      {/* Use flex to center content vertically and horizontally */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-lg text-center">
          <h1 className="text-3xl font-extrabold text-purple-600 mb-4">Welcome to Your Dashboard</h1>
          <p className="text-gray-700 text-lg mb-6">
            You have successfully logged in. Use the navigation below to explore your account.
          </p>

          {/* Render Profile or Account components based on routing */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
