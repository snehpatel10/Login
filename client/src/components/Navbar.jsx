import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';  // No need for useNavigate here
import toast, { Toaster } from 'react-hot-toast';
import { IoSettings } from 'react-icons/io5';
import { useSpring, animated } from 'react-spring';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => window.location.href = '/login', 1000); // Manually redirect after logout
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const gearSpring = useSpring({
    transform: dropdownOpen ? 'rotate(45deg)' : 'rotate(0deg)',
    config: { tension: 200, friction: 15 },
  });

  const dropdownSpring = useSpring({
    opacity: dropdownOpen ? 1 : 0,
    transform: dropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
    config: { tension: 250, friction: 20 },
  });

  return (
    <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-teal-400">My Dashboard</h1>
        <div className="relative">
          <animated.div
            onClick={toggleDropdown}
            style={gearSpring}
            className="cursor-pointer"
          >
            <IoSettings className="w-6 h-6 text-gray-100" />
          </animated.div>
          {dropdownOpen && (
            <animated.div
              ref={dropdownRef}
              style={dropdownSpring}
              className="absolute right-0 mt-2 w-48 bg-[#28293D] text-gray-200 rounded-lg shadow-lg"
            >
              <div className="py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-lg"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-lg"
                  onClick={() => setDropdownOpen(false)}
                >
                  Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </animated.div>
          )}
        </div>
      </div>
      <Toaster />
    </nav>
  );
}

export default Navbar;
