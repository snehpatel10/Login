import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const email = localStorage.getItem('userEmail');

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

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
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

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
            localStorage.removeItem('userEmail');
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

            {/* Reset Password Form */}
            <div className="bg-[#121212]/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full">
                <h2 className="text-3xl font-extralight text-[#FFFFFF] text-center mb-6 tracking-wide">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Input */}
                    <div>
                        <label className="block text-[#BB86FC] font-normal">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                            placeholder="Enter new password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-[#BB86FC] font-normal">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full p-3 mt-2 mb-4 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`mt-10 w-full py-3 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6e34f0] hover:bg-[#4b1fba]'
                        } text-white text-lg font-normal rounded-lg shadow-lg focus:outline-none transition duration-300`}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    );
}

export default ResetPassword;
