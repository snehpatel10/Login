import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = localStorage.getItem('userEmail');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error('Both password fields are required');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            toast.error('Password must be at least 8 characters long and contain both letters and numbers');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/otp/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send the new password to backend
            });

            const data = await response.json();  // Log response data from backend

            if (data.success) {
                toast.success('Password has been successfully reset!');
                setTimeout(() => navigate('/login'), 500);
            } else {
                toast.error(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while resetting the password. Please try again.');
        } finally {
            setLoading(false);
        }
        localStorage.removeItem('userEmail');
    };

    return (
        <div>
            <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-extrabold text-center text-purple-600 mb-4">
                        Reset Password
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 font-medium">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                aria-label="New Password"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                aria-label="Confirm Password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mt-6 w-full py-2 ${loading ? 'bg-gray-400' : 'bg-purple-600'} text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition duration-300`}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default ResetPassword;
