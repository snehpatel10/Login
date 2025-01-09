import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

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

            {/* Login Form Container */}
            <div className="bg-[#121212]/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full">
                <h2 className="text-3xl font-extralight text-[#FFFFFF] text-center mb-6">
                    Log In
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-[#BB86FC] font-normal">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                            placeholder="Enter your email"
                        />
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
                                    {showPassword ? (
                                        <HiEyeSlash className="w-6 h-6" />
                                    ) : (
                                        <HiEye className="w-6 h-6" />
                                    )}
                                </button>
                            )}
                        </div>
                        {/* Forgot password? */}
                        <div className="flex justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-[#BB86FC] hover:text-[#9e53f8] text-sm transition-all duration-150"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#6e34f0] text-[#FFFFFF] text-lg font-normal rounded-lg shadow-lg hover:bg-[#4b1fba] transition-all"
                    >
                        Log In
                    </button>

                    {/* Footer Links */}
                    <div className="text-center">
                        <p className="text-[#BBBBBB] font-light">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-[#BB86FC] hover:text-[#9e53f8] transition-all duration-150"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    );
}

export default LoginPage;
