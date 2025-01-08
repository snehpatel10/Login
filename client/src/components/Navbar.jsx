import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useSpring, animated } from 'react-spring';  // Import react-spring
import { IoSettings } from 'react-icons/io5';  // Import the IoSettings icon from react-icons

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown menu
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);  // Toggle the dropdown state
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Gear button animation with react-spring
  const gearSpring = useSpring({
    transform: dropdownOpen ? 'rotate(45deg)' : 'rotate(0deg)',  // Rotation when opened/closed
    config: { tension: 250, friction: 20 },
  });

  // Dropdown menu animation with react-spring
  const dropdownSpring = useSpring({
    opacity: dropdownOpen ? 1 : 0,
    transform: dropdownOpen ? 'translateY(0px)' : 'translateY(-10px)',  // Slide-in effect
    config: { tension: 250, friction: 25 },
  });

  return (
    <div className="bg-gray-800 text-gray-200 shadow-lg p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-indigo-400">Your Dashboard</h1>

        <div className="flex items-center space-x-4 mr-4">
          <div className="relative">
            {/* Animated Settings Icon (without button look) */}
            <animated.div
              onClick={toggleDropdown}  // Toggle dropdown on click
              style={gearSpring}  // Apply the gear rotation animation
              className="cursor-pointer"
            >
              <IoSettings className="w-6 h-6 text-white" /> {/* Settings Icon */}
            </animated.div>

            {/* Animated Dropdown Menu */}
            {dropdownOpen && (
              <animated.div
                ref={dropdownRef}
                style={dropdownSpring}  // Apply the dropdown animation
                className="absolute right-0 w-48 mt-2 bg-gray-700 text-gray-200 rounded-lg shadow-xl transition-all duration-200 ease-in-out opacity-100"
              >
                <div className="py-2 px-4">
                  <Link
                    to="/profile"
                    className="block px-3 mt-2 py-2 text-sm font-medium hover:bg-indigo-600 rounded-lg transition duration-200 ease-in-out"
                    onClick={() => setDropdownOpen(false)}  // Close dropdown after clicking
                  >
                    Profile
                  </Link>
                  <Link
                    to="/account"
                    className="block px-3 py-2 text-sm font-medium hover:bg-indigo-600 rounded-lg transition duration-200 ease-in-out"
                    onClick={() => setDropdownOpen(false)}  // Close dropdown after clicking
                  >
                    Account Settings
                  </Link>
                  {/* Logout Button in Dropdown */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left mb-2 block px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-600 rounded-lg transition duration-200 ease-in-out"
                  >
                    Logout
                  </button>
                </div>
              </animated.div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Navbar;
