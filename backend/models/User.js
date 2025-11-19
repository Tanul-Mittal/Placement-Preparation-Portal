import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    name:{
        type:String,
        trim:true
    },

    password: {
        type: String,
        required: true
    },

    // OPTIONAL FIELDS
    college: {
        type: String,
        trim: true
    },

    dateofBirth: {
        type: Date
    },

    phoneNumber: {
        type: String,
        trim: true
    },

    course: {
        type: String,
        trim: true
    },

    passoutyear: {
        type: Number
    },

    // OTP or Verification Token
    token: {
        type: String,
        default: null,
    },

    expirationTime: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true
});

export default mongoose.model("User", UserSchema);
