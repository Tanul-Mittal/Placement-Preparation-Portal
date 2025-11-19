import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/profileSlice";
import toast from "react-hot-toast";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Dispatch logout action to clear user state and localStorage
        dispatch(logout());

        // Show success message
        toast.success("Logged out successfully");

        // Redirect to login page after a short delay
        const timer = setTimeout(() => {
            navigate("/login");
        }, 1000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Logging out...
                </h2>

                <p className="text-gray-600 dark:text-gray-400">
                    You will be redirected to the login page shortly.
                </p>

                {/* Loading spinner */}
                <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        </div>
    );
};

export default Logout;
