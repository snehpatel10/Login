import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import myImage from '../assets/rb_399 (1).svg';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            let result = await fetch('http://localhost:3000/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!result.ok) {
                toast.error('Invalid email or password');
                return;
            }

            result = await result.json();

            if (result && result.name) {
                localStorage.setItem('user', JSON.stringify(result));
                toast.success('Logged in successfully');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error('Login failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred, please try again');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFFF]">
            <div className="flex flex-col md:flex-row bg-[#FFFFFF] rounded-lg shadow-md overflow-hidden max-w-5xl">
                {/* Left Section with Image */}
                <div className="hidden md:block bg-[#A294F9] w-full md:w-1/2 items-center justify-center p-10">
                    <div className="text-center">
                        <img
                            src={myImage}
                            alt="Login Illustration"
                            className="w-64 h-auto mx-auto"
                        />
                        <h2 className="text-4xl font-bold text-white mt-4">Welcome Back!</h2>
                        <p className="text-white mt-2">
                            Please log in to access your account and get started.
                        </p>
                    </div>
                </div>

                {/* Right Section with Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-3xl font-bold text-[#4A4A4A] text-center mb-6">Log In</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[#4A4A4A] font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-[#4A4A4A] font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                                    placeholder="Enter your password"
                                />
                                {password && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <HiEyeSlash className="w-6 h-6" />
                                        ) : (
                                            <HiEye className="w-6 h-6" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#A294F9] text-white text-lg font-semibold rounded-lg hover:bg-[#8c77e1] transition duration-300"
                        >
                            Log In
                        </button>

                        <div className="mt-6 text-center">
    <p className="text-[#4A4A4A]">
        <span className="mr-1">Don't have an account?</span>
        <Link 
            to="/signup" 
            className="text-[#A294F9] hover:text-[#7B63E1] font-medium transition-all duration-300"
        >
            Sign Up
        </Link>
    </p>
    <p className="text-[#4A4A4A] mt-4">
        <span className="mr-1">Forgot your password?</span>
        <Link 
            to="/forgot-password" 
            className="text-[#A294F9] hover:text-[#7B63E1] font-medium transition-all duration-300"
        >
            Reset It
        </Link>
    </p>
</div>

                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default LoginPage;
