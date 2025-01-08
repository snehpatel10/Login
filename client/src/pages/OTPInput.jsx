import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast';

function OTPInput() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        toast.dismiss();
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
            <Toaster />
        </div>
    )
}

export default OTPInput
