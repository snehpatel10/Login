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
        <div>
            <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-extrabold text-center text-purple-600 mb-4">
                        Forgot Password
                    </h2>

                    {!isOtpSent ? (
                        <form className="space-y-5" onSubmit={handleSendOtp}>
                            <div>
                                <label className="block text-gray-700 font-medium">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    aria-label="Email Address"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`mt-6 w-full py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white text-lg font-semibold rounded-xl transition duration-300`}
                                disabled={loading} // Disable the button during loading
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>

                        </form>
                    ) : (
                        <form className="space-y-5" onSubmit={handleOtpSubmit}>
                            <div>
                                <label className="block text-gray-700 font-medium">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    maxLength={6}
                                    aria-label="Enter OTP"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`mt-6 w-full py-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white text-lg font-semibold rounded-xl transition duration-300`}
                                disabled={loading} // Disable the button during loading
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                        </form>
                    )}
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default ForgotPassword;
