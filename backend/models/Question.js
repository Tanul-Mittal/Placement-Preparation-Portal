import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String],
    },
    correctAnswer: {
        type: String,
        required: true,
        trim: true,
    },
    hasOptions: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        enum: ['reasoning', 'aptitude', 'dsa', 'corecs'],
        required: true,
    },
    subcategory: {
        type: String,
        trim: true,
    },
    explanation: {
        type: String,
        trim: true,
        default: "",
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    }],
    question_image: [{
        type: String,
        trim: true,
    }],
}, {
    timestamps: true,
});

export default mongoose.model("Question", QuestionSchema);