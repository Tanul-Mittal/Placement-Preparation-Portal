import mongoose from "mongoose";

const LoginNotificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    loginTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    timestamps: true, // automatically adds createdAt and updatedAt fields
});

export default mongoose.model("LoginNotification", LoginNotificationSchema);

