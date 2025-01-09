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
        <div className="min-h-screen bg-[#F5EFFF] flex items-center justify-center py-8">
            <div className="bg-white rounded-xl shadow-lg w-full sm:w-96 p-8">
                <h2 className="text-3xl font-extrabold text-[#4A4A4A] text-center mb-8">
                    Reset Your Password
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[#4A4A4A] font-medium">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-4 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-[#4A4A4A] font-medium">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full p-4 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`mt-6 w-full py-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A294F9] hover:bg-[#8c77e1] active:bg-[#7b65e0]'} text-white text-lg font-semibold rounded-lg shadow-lg focus:outline-none transition duration-300`}
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
