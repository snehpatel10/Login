import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

            // Check if the response was successful
            if (!result.ok) {
                // If not, handle the error by showing the login failed message
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
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-extrabold text-center text-purple-600 mb-4">Log In</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition duration-300"
                    >
                        Log In
                    </button>
                    <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-purple-600 hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-sm text-gray-600">
                            Having trouble logging in?{' '}
                            <Link to="/forgot-password" className="text-purple-600 hover:underline">
                                Reset Your Password
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
