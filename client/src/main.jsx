import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignupPage.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import Layout from './Layout.jsx';
import HomePage from './components/HomePage.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Profile from './components/Profile.jsx';
import Account from './components/Account.jsx';

const router = createBrowserRouter([
  {
    path: '/',  // Layout route
    element: <Layout />,  // Main layout containing the Navbar and Outlet
    children: [
      {
        path: '/',  // HomePage route
        element: <HomePage />,  // HomePage rendered
        children: [
          {
            path: 'profile',  // Profile is rendered inside HomePage as an outlet
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: '/account',  // Account route
    element: <Account />,  // Account page
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/forgot-password/reset-password',
    element: <ResetPassword />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
