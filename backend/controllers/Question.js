import mongoose from "mongoose";
import Question from "../models/Question.js";
import Company from "../models/Company.js";

const VALID_CATEGORIES = ["Reasoning", "Aptitude", "DSA", "CoreCS"];

export const addQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Request body must contain a non-empty 'questions' array.",
            });
        }

        const results = [];
        const errors = [];

        for (let i = 0; i < questions.length; i++) {
            const ques = questions[i];
            const {
                question,
                options,
                correctAnswer,
                hasOptions,
                category,
                subcategory,
                explanation,
                company,
                question_image,
            } = ques;

            // Basic validation
            if (
                !question ||
                !correctAnswer ||
                typeof hasOptions === "undefined"
            ) {
                errors.push({
                    index: i,
                    question: question || "Missing Question",
                    message:
                        "Required fields are missing: question, correctAnswer and hasOptions are required.",
                });
                continue;
            }

            // category validation (since model requires it)
            if (!category || !VALID_CATEGORIES.includes(category)) {
                errors.push({
                    index: i,
                    question,
                    message: `Invalid or missing category. Allowed: ${VALID_CATEGORIES.join(
                        ", "
                    )}.`,
                });
                continue;
            }

            // when hasOptions is true, ensure options is an array with at least 2 items
            if (hasOptions && (!Array.isArray(options) || options.length < 2)) {
                errors.push({
                    index: i,
                    question,
                    message:
                        "hasOptions is true but 'options' must be an array with at least 2 strings.",
                });
                continue;
            }

            // Normalize company input: accept single string or array
            let companyInputs = [];
            if (company) {
                companyInputs = Array.isArray(company) ? company : [company];
            } else {
                errors.push({
                    index: i,
                    question,
                    message:
                        "Company is required and must be a company id or company name (or array of them).",
                });
                continue;
            }

            // Convert company names to IDs (create company if name not found)
            const companyIds = [];
            try {
                for (const comp of companyInputs) {
                    // if it's a valid ObjectId, assume it's an id
                    if (mongoose.isValidObjectId(comp)) {
                        companyIds.push(comp);
                        continue;
                    }

                    // otherwise treat as company name (string)
                    const compName = String(comp).trim();
                    if (!compName) continue;

                    // case-insensitive exact match for company name
                    const existingCompany = await Company.findOne({
                        company: {
                            $regex: `^${escapeRegExp(compName)}$`,
                            $options: "i",
                        },
                    });

                    if (existingCompany) {
                        companyIds.push(existingCompany._id);
                    } else {
                        // create new company
                        const newCompany = await Company.create({
                            company: compName,
                        });
                        companyIds.push(newCompany._id);
                    }
                }
            } catch (err) {
                console.error("Error resolving/creating companies:", err);
                errors.push({
                    index: i,
                    question,
                    message:
                        "Error resolving or creating companies: " +
                        (err.message || err),
                });
                continue;
            }

            // validate resolved company ids
            const invalidCompanyId = companyIds.find(
                (id) => !mongoose.isValidObjectId(id)
            );
            if (invalidCompanyId) {
                errors.push({
                    index: i,
                    question,
                    message: `Invalid company id after resolution: ${invalidCompanyId}`,
                });
                continue;
            }

            // Duplicate check: exact, word-for-word match on 'question'
            const trimmedQuestionText = question.trim();
            const existing = await Question.findOne({
                question: trimmedQuestionText,
            });

            if (existing) {
                errors.push({
                    index: i,
                    question: trimmedQuestionText,
                    message:
                        "Duplicate question found (word-for-word). Skipped creation.",
                    existingQuestionId: existing._id,
                });
                continue;
            }

            // Create question and update companies
            try {
                const questionEntry = await Question.create({
                    question: trimmedQuestionText,
                    options: Array.isArray(options) ? options : [],
                    correctAnswer,
                    hasOptions,
                    category,
                    subcategory,
                    explanation: explanation || "",
                    company: companyIds,
                    question_image: Array.isArray(question_image)
                        ? question_image
                        : question_image
                        ? [question_image]
                        : [],
                });

                results.push(questionEntry);

                // Update each company to include this question (avoid duplicates with $addToSet)
                const updateCompanyPromises = companyIds.map((companyId) =>
                    Company.findByIdAndUpdate(
                        companyId,
                        { $addToSet: { questions: questionEntry._id } },
                        { new: true, runValidators: true }
                    )
                );
                await Promise.all(updateCompanyPromises);
            } catch (err) {
                console.error(
                    "Error creating question or updating company:",
                    err
                );
                errors.push({
                    index: i,
                    question: question || "Unknown Question",
                    message:
                        err.message || "Unknown error while creating question.",
                });
            }
        } // end for

        if (errors.length > 0) {
            return res.status(207).json({
                success: true,
                message:
                    "Some questions were added successfully, but others failed or were duplicates.",
                successCount: results.length,
                failedCount: errors.length,
                failedQuestions: errors,
                data: results,
            });
        }

        return res.status(201).json({
            success: true,
            message: "All questions added successfully.",
            data: results,
        });
    } catch (error) {
        console.error("Unexpected error in addQuestions:", error);
        return res.status(500).json({
            success: false,
            message: `Some unexpected problem happened while adding questions: ${error.message}`,
        });
    }
};

// helper to escape user input for regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
