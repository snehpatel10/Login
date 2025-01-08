import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { HiEye, HiEyeSlash } from 'react-icons/hi2'; // Eye icons for password toggle

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const emailInputRef = useRef(null); // Reference for email input

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let result = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      result = await result.json();

      if (result.success === false && result.message === 'Email already in use. Please use a different email.') {
        toast.error('This email is already in use. Please use a different email.');
        setEmail('');
        setEmailError('Email already in use');
        emailInputRef.current.focus();
        return;
      }

      if (result.success) {
        toast.success('Account created successfully');
        localStorage.setItem('user', JSON.stringify(result.user));
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error('Registration failed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred, please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-center text-purple-600 mb-4">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              className={`w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
              }`}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <HiEyeSlash className="w-6 h-6" /> : <HiEye className="w-6 h-6" />}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition duration-300"
          >
            Sign Up
          </button>

          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default SignUp;
