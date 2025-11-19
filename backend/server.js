import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { dbConnect } from "./config/DatabaseConnection.js";
import AuthenticationRoutes from './routes/Auth.js'
import QuestionRoutes from './routes/Question.js'
import cookieParser from 'cookie-parser';

config();

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
app.use(cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all necessary HTTP methods
    credentials: true,  // Allow cookies and other credentials
}));

dbConnect();


// Test route
app.get("/", (req, res) => {
    res.send("Backend is running...");
});

app.use("/api/v1/authentication",AuthenticationRoutes);
app.use("/api/v1/question",QuestionRoutes)


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
