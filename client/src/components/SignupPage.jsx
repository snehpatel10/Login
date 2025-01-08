import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { HiEye, HiEyeSlash } from 'react-icons/hi2'; // Eye icons for password toggle
import myImage from '../assets/rb_7875.svg'; // Image for the right side section

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

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
    <div className="min-h-screen bg-[#F5EFFF] flex items-center justify-center py-4">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full overflow-hidden flex">

        {/* Left Section with Form */}
        <div className="w-full md:w-1/2 p-6 bg-[#FFFFFF] flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-[#4A4A4A] text-center mb-4">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-[#4A4A4A] font-medium text-sm">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-1 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[#4A4A4A] font-medium text-sm">Email</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full p-2 mt-1 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-200 ${
                  emailError ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Enter your email"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#4A4A4A] font-medium text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mt-1 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-200"
                  placeholder="Enter your password"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#A294F9] text-white text-lg font-semibold rounded-lg hover:bg-[#8c77e1] transition duration-200"
            >
              Sign Up
            </button>

            {/* Existing Account Links */}
            <div className="mt-5 text-center">
              <p className="text-[#4A4A4A] text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#A294F9] hover:text-[#7B63E1] font-medium transition-all duration-200"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Section with Image */}
        <div className="w-1/2 p-6 bg-[#A294F9] flex flex-col items-center justify-center text-center">
          <img
            src={myImage}
            alt="Sign Up Illustration"
            className="w-48 h-auto mb-3"
          />
          <h2 className="text-3xl font-extrabold text-white mt-3">Join Us Now!</h2>
          <p className="text-white mt-2 text-sm">
            Sign up to start your journey with us. Experience the best of everything!
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default SignUp;
