import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { authenticationEndpoints } from "../../api/api";
import axios from "axios";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const { signUpData } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);

    const { SIGNUP_API, SEND_OTP_API } = authenticationEndpoints;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                SIGNUP_API,
                {
                    email: signUpData.email,
                    password: signUpData.password,
                    otp: otp,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            if (result.success) {
                navigate("/login");
                toast.success("Verified");
            } else {
                toast.error("Verification failed");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("Signup failed");
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const { email } = signUpData; // Assuming signupData is accessible here
            const response = await axios.post(SEND_OTP_API, { email }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                toast.success("OTP resent successfully");
            } else {
                toast.error("Failed to resend OTP");
            }
        } catch (error) {
            console.error("Error occurred while resending OTP:", error);
            toast.error("Failed to resend OTP");
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full bg-[#e9edf0] text-black">
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-8 gap-4 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800">Verify Email</h2>
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-600">
                        The verification code has been sent to you. Enter
                        the code below
                    </p>
                </div>

                <div className="flex justify-center my-4">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span className="mx-1 text-gray-400 text-lg">-</span>}
                        renderInput={(props) => (
                            <input
                                {...props}
                                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-gray-400"
                            />
                        )}
                        containerStyle={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.75rem"
                        }}
                    />
                </div>
                <div className="mt-2">
                    <p className="text-sm text-gray-600 text-center">
                        Didn't receive the OTP?{" "}
                        <button 
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Resend OTP
                        </button>
                    </p>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubmit}
                        className={`text-white bg-[#007aff] px-8 py-3 rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-200 w-fit font-semibold shadow-md ${loading ? "opacity-70 cursor-not-allowed" : "opacity-100"}`}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
