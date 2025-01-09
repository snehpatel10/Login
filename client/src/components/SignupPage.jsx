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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(46, 17, 87, 1) 0%, rgba(58, 30, 85, 1) 25%, rgba(30, 17, 46, 1) 75%, rgba(15, 0, 30, 1) 100%)',
      }}
    >
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#BB86FC] to-[#3700B3] blur-3xl opacity-20 rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-[#03DAC6] to-[#BB86FC] blur-3xl opacity-20 rounded-full bottom-20 right-10"></div>

      <div className="bg-[#121212]/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl flex">

        {/* Left Section with Form */}
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-extralight text-[#FFFFFF] text-center mb-6 tracking-wide">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-[#BB86FC] font-normal">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[#BB86FC] font-normal">Email</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[#BB86FC] font-normal">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                  placeholder="Enter your password"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-[#BB86FC] hover:text-[#FFFFFF]"
                  >
                    {showPassword ? <HiEyeSlash className="w-6 h-6" /> : <HiEye className="w-6 h-6" />}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#6e34f0] text-[#FFFFFF] text-lg font-normal rounded-lg shadow-lg hover:bg-[#4b1fba] transition-all"
            >
              Sign Up
            </button>

            {/* Existing Account Links */}
            <div className="text-center">
              <p className="text-[#BBBBBB] font-light">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#BB86FC] hover:text-[#9e53f8] transition-all duration-150"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Section with Image */}
        <div className="flex-1 p-6 bg-[#A294F9] flex flex-col items-center justify-center text-center rounded-r-2xl">
          <img
            src={myImage}
            alt="Sign Up Illustration"
            className="w-48 h-auto mb-3"
          />
          <h2 className="text-3xl font-light text-white mt-3">Join Us Now!</h2>
          <p className="text-white mt-2 text-sm font-extralight tracking-wide">
            Sign up to start your journey with us. Experience the best of everything!
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default SignUp;
