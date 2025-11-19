import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

OTPSchema.pre("save", async function (next) {
    try {
        // Only send email if it's a new OTP
        if (this.isNew) {
            const emailContent = `
                <p>Dear User,</p>

                <p>You have requested an OTP to verify your account on <strong>HireVision</strong>.</p>

                <p>Please use the following OTP to complete your verification:</p>

                <p style="font-size: 20px; font-weight: bold; color: #007aff; background-color: #f0f8ff; padding: 10px; border-radius: 5px;">
                    ${this.otp}
                </p>

                <p>This OTP is valid only for a short time. If you did not request this, please ignore this email — your account is safe.</p>

                <p>
                    HireVision is a platform created to help students prepare for placements through 
                    practice questions, company-wise interview experiences, quizzes, coding help, and more.
                    We’re excited to have you with us on your placement journey!
                </p>

                <p>If you have any questions or need assistance, feel free to reply to this email.</p>
                
                <br>

                <p>Best regards,</p>
                <p><strong>Team HireVision</strong></p>
            `;

            await mailSender(
                this.email,
                "OTP for Verification - HireVision",
                emailContent
            );
            console.log("Mail sent successfully");
        }
    } catch (error) {
        console.log("Error while sending the mail for OTP:", error.message);
    }
    next();
});

export default mongoose.model("OTP", OTPSchema);
