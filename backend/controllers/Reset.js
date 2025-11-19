import User from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Reset Password Token
export const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User is not registered. Please sign up to reset the password.",
                toastMessage:
                    "Email is not registered. Please head over to the signup page.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                token,
                expirationTime: Date.now() + 5 * 60 * 1000, // 5 minutes
            },
            { new: true }
        );

        const url = `https://leetcode-analyzer.vercel.app/update-password/${token}`;
        const emailContent = `
    <p>We received a request to reset your password associated with your account. To proceed, please click the link below:</p>
    <p><a href="${url}">Reset Your Password</a></p>
    <p>This link will expire in 5 minutes, so we encourage you to reset your password promptly. If you did not request a password reset, please disregard this email. Your account security is important to us.</p>
    <p>If you have any questions or need further assistance, feel free to reply to this email. We're here to help.</p>
    <br>
    <p>Best regards,</p>
    <p>Shivam Aggarwal</p>
    <p>LeetCode Analyzer</p>
`;

        await mailSender(
            email,
            "Reset Your Password - LeetCode Analyzer",
            emailContent
        );

        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully.",
            toastMessage: "Reset link sent to your email.",
            updatedUser,
        });
    } catch (error) {
        console.error("Error during token generation:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating reset password token.",
            toastMessage: "Technical error!",
        });
    }
};
// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match.",
                toastMessage: "Passwords do not match.",
            });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid token or user does not exist.",
                toastMessage: "Reset link has expired.",
            });
        }

        if (user.expirationTime < Date.now()) {
            return res.status(410).json({
                success: false,
                message: "Reset link has expired.",
                toastMessage: "Reset link has expired.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token },
            {
                password: hashedPassword,
                token: null,
                expirationTime: null,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
            toastMessage: "Password reset successfully.",
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating password.",
            toastMessage: "Technical error!",
        });
    }
};
export const modfiyUserProfile = async (req, res) => {
    try {
        // determine target user id
        const targetId = (req.user && req.user._id) || req.params.id;
        if (!targetId) {
            return res.status(400).json({
                success: false,
                message:
                    "No user id provided (use authenticated user or pass id in params).",
            });
        }

        if (!mongoose.isValidObjectId(targetId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id.",
            });
        }

        // whitelist of fields that can be modified
        const allowed = [
            "email",
            "college",
            "dateOfBirth",
            "phoneNumber",
            "course",
            "passoutYear",
        ];
        const updates = {};

        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updates[key] = req.body[key];
            }
        }

        // nothing to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided to update.",
            });
        }

        // email normalization + validation + uniqueness check
        if (updates.email) {
            const email = String(updates.email).trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format.",
                });
            }
            // check if some other user already has this email
            const existing = await User.findOne({
                email,
                _id: { $ne: targetId },
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already in use by another account.",
                });
            }
            updates.email = email;
        }

        // basic phone number validation (optional tweak for your region)
        if (updates.phoneNumber) {
            const phone = String(updates.phoneNumber).trim();
            // here simple check: 7-15 digits, can start with +; change according to your needs
            const phoneRegex = /^(\+?\d{7,15})$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid phone number format.",
                });
            }
            updates.phoneNumber = phone;
        }

        // normalize passoutYear to Number if provided
        if (updates.passoutYear) {
            const year = Number(updates.passoutYear);
            if (Number.isNaN(year) || year < 1900 || year > 2100) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid passoutYear.",
                });
            }
            updates.passoutYear = year;
        }

        // normalize dateOfBirth to Date if provided
        if (updates.dateOfBirth) {
            const dob = new Date(updates.dateOfBirth);
            if (isNaN(dob.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid dateOfBirth.",
                });
            }
            updates.dateOfBirth = dob;
        }

        // finally update
        const updatedUser = await User.findByIdAndUpdate(
            targetId,
            { $set: updates },
            { new: true, runValidators: true, context: "query" }
        ).select("-password"); // exclude password from response

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error in modfiyUserProfile:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating profile.",
        });
    }
};
