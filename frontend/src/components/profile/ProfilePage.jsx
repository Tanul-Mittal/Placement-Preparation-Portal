import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../slices/profileSlice";
import { authenticationEndpoints } from "../../api/api";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    MdEmail,
    MdPerson,
    MdSchool,
    MdPhone,
    MdCalendarToday,
    MdBook,
    MdEdit,
    MdArrowBack,
} from "react-icons/md";

const ProfilePage = () => {
    const { user, token } = useSelector((s) => s.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Prepare sensible defaults and normalized user shape
    const normalizedUser = useMemo(() => {
        if (!user) return {};
        // prefer consistent keys used by the form
        const passout = user.passoutYear ?? user.passoutyear ?? "";
        const dobRaw = user.dateOfBirth ?? user.dateofBirth ?? "";
        // convert to yyyy-mm-dd if possible
        let dateOfBirth = "";
        if (dobRaw) {
            const d = new Date(dobRaw);
            if (!isNaN(d.getTime()))
                dateOfBirth = d.toISOString().split("T")[0];
        }
        return {
            name: user.name ?? "",
            email: user.email ?? "",
            college: user.college ?? "",
            phoneNumber: user.phoneNumber ?? "",
            course: user.course ?? "",
            passoutYear: passout,
            dateOfBirth,
        };
    }, [user]);

    const { UPDATE_PROFILE_API } = authenticationEndpoints;

    // initialize react-hook-form with defaultValues so reset behaves well
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({ defaultValues: normalizedUser });

    // populate whenever user changes
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        reset(normalizedUser);
    }, [user, normalizedUser, reset, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        const toastId = toast.loading("Updating profile...");

        try {
            const payload = {
                userId: user._id ?? user.id,
                name: data.name,
                email: data.email,
                college: data.college,
                phoneNumber: data.phoneNumber,
                course: data.course,
                passoutYear: data.passoutYear,
                dateOfBirth: data.dateOfBirth,
            };

            const response = await axios.put(UPDATE_PROFILE_API, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (response?.data?.success) {
                dispatch(setUser(response.data.data));
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(
                    response?.data?.message ?? "Failed to update profile"
                );
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            const msg =
                err?.response?.data?.message ?? "Failed to update profile";
            toast.error(msg);
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        reset(normalizedUser);
        setIsEditing(false);
    };

    if (!user) return null;

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((p) => p[0] || "")
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <MdArrowBack className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 h-32" />
                    <div className="px-8 pb-8 -mt-16">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-black">
                                    {getInitials(user.name)}
                                </div>
                                <button
                                    onClick={() => setIsEditing((s) => !s)}
                                    aria-label="Edit profile"
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <MdEdit className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {user.name ?? "User"}
                                </h1>
                                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                    <MdEmail className="w-4 h-4" />
                                    {user.email}
                                </p>
                                {user.college && (
                                    <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                                        <MdSchool className="w-4 h-4" />
                                        {user.college}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Profile Information
                        </h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <MdEdit className="w-5 h-5" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdPerson className="w-5 h-5 text-blue-600" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    placeholder="Enter your name"
                                    aria-invalid={
                                        errors.name ? "true" : "false"
                                    }
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("name", {
                                        required: "Name is required",
                                        maxLength: {
                                            value: 100,
                                            message:
                                                "Name must be less than 100 characters",
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdEmail className="w-5 h-5 text-blue-600" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    disabled={!isEditing}
                                    placeholder="Enter your email"
                                    aria-invalid={
                                        errors.email ? "true" : "false"
                                    }
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email format",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* College */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdSchool className="w-5 h-5 text-blue-600" />
                                    College/University
                                </label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    placeholder="Enter your college name"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("college")}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdPhone className="w-5 h-5 text-blue-600" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("phoneNumber", {
                                        pattern: {
                                            value: /^(\+?\d{7,15})$/,
                                            message:
                                                "Invalid phone number format",
                                        },
                                    })}
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-sm">
                                        {errors.phoneNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Course */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdBook className="w-5 h-5 text-blue-600" />
                                    Course/Stream
                                </label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    placeholder="Enter your course"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("course")}
                                />
                            </div>

                            {/* Passout Year */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdCalendarToday className="w-5 h-5 text-blue-600" />
                                    Passout Year
                                </label>
                                <input
                                    type="number"
                                    disabled={!isEditing}
                                    placeholder="Enter passout year"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("passoutYear", {
                                        valueAsNumber: true,
                                        min: {
                                            value: 1900,
                                            message: "Year must be after 1900",
                                        },
                                        max: {
                                            value: 2100,
                                            message: "Year must be before 2100",
                                        },
                                    })}
                                />
                                {errors.passoutYear && (
                                    <p className="text-red-500 text-sm">
                                        {errors.passoutYear.message}
                                    </p>
                                )}
                            </div>

                            {/* DOB full width */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MdCalendarToday className="w-5 h-5 text-blue-600" />
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                                        isEditing
                                            ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                                    }`}
                                    {...register("dateOfBirth")}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition-all font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${
                                        !loading
                                            ? "hover:shadow-xl hover:scale-105"
                                            : ""
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-5 w-5"
                                                viewBox="0 0 24 24"
                                                aria-hidden
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                                                />
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
