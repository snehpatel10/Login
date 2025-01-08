import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));  // Get user from localStorage

  useEffect(() => {
    // If there's no user in localStorage, redirect to login page
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      {/* The Outlet will render the child components */}
      {user ? (
        // If user exists, show child routes
        <Outlet />
      ) : (
        // Optionally, you could show a loading spinner or placeholder while checking
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Layout;
