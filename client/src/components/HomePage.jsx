import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function HomePage() {
  return (
    <div className="bg-gradient-to-r from-[#1E1E2F] to-[#3A2B4A] min-h-screen">
      {/* Navbar at the top of the page */}
      <Navbar />

      {/* Main Content Area */}
        
          {/* Content displayed when no specific child route is selected */}
          

          {/* Render child routes dynamically using Outlet */}
          <div className="mt-6">
            <Outlet /> {/* This will render Profile or Account based on routing */}
          </div>
    </div>
  );
}

export default HomePage;
