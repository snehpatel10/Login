import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        toast.dismiss();
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        toast.dismiss();
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email is required');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/otp/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('OTP has been sent to your email!');
                localStorage.setItem('userEmail', email);
                setIsOtpSent(true);
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while sending OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error('OTP is required');
            return;
        }

        const otpPattern = /^[0-9]{6}$/;
        if (!otpPattern.test(otp)) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/otp/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('OTP verified successfully!');
                setTimeout(() => navigate('/forgot-password/reset-password'), 500);
            } else {
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while verifying OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-[#2E1157] via-[#3A1E55] to-[#1E1130]">
            <div className="w-full max-w-lg bg-[#121212]/80 backdrop-blur-md rounded-xl shadow-2xl p-6">
                <h2 className="text-3xl font-extralight text-[#FFFFFF] text-center mb-6 tracking-wide">
                    {isOtpSent ? 'Enter OTP' : 'Forgot Password'}
                </h2>

                <form onSubmit={isOtpSent ? handleOtpSubmit : handleSendOtp} className="space-y-6">
                    {!isOtpSent ? (
                        <div>
                            <label className="block text-[#BB86FC] font-normal">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                                placeholder="Enter your email"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-[#BB86FC] font-normal">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full p-3 mt-2 bg-[#1E1E2F] border-none rounded-lg shadow-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#BB86FC] transition-all"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-normal text-lg shadow-lg transition-all flex items-center justify-center ${
                            loading
                                ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#6e34f0] to-[#4b1fba] text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#5a2ed3] hover:to-[#3c178a]'
                        }`}
                        disabled={loading}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        )}
                        {loading ? (isOtpSent ? 'Verifying...' : 'Sending...') : isOtpSent ? 'Verify OTP' : 'Send OTP'}
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    );
}

export default ForgotPassword;
