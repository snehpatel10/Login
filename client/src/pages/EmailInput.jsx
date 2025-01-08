import React from 'react'
import { useState } from 'react';
import  toast, {Toaster}from 'react-hot-toast';

function EmailInput() {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
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
                localStorage.setItem('isOtpSent', 'true');
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
    return (
        <div>
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
            <Toaster />
        </div>
    )
}

export default EmailInput
