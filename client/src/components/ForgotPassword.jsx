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
        <div className="min-h-screen bg-[#F5EFFF] flex items-center justify-center py-8">
            <div className="bg-white rounded-xl shadow-xl w-full sm:w-96 p-8">
                <h2 className="text-2xl font-extrabold text-[#4A4A4A] text-center mb-6">
                    Forgot Password
                </h2>

                {/* Conditional rendering of the form */}
                {!isOtpSent ? (
                    <form className="space-y-6" onSubmit={handleSendOtp}>
                        <div>
                            <label className="block text-[#4A4A4A] font-medium">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full p-3 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                                placeholder="Enter your email"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mt-6 w-full py-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A294F9] hover:bg-[#8c77e1]'} text-white text-lg font-semibold rounded-lg transition duration-300`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleOtpSubmit}>
                        <div>
                            <label className="block text-[#4A4A4A] font-medium">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full p-3 mt-2 border border-[#CDC1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition-all duration-300"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mt-6 w-full py-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A294F9] hover:bg-[#8c77e1]'} text-white text-lg font-semibold rounded-lg transition duration-300`}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}
            </div>

            <Toaster />
        </div>
    );
}

export default ForgotPassword;
