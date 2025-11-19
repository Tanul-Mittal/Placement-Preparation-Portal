import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }],
    company_img: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model("Company", CompanySchema);