import mongoose from "mongoose";
import Question from "../models/Question.js";
import Company from "../models/Company.js";


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
            const VALID_CATEGORIES = ['reasoning', 'aptitude', 'dsa', 'corecs'];

            if (!category || typeof category !== 'string' || !VALID_CATEGORIES.includes(category.trim().toLowerCase())) {
            
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

export const retrieveQuestionsCompanyWise = async (req, res) => {
    try {
        const { company } = req.body;

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "'company' (id or name) is required.",
            });
        }

        // Normalize company input to array
        const companyInputs = Array.isArray(company) ? company : [company];

        // Resolve companies → fetch full company docs
        const resolvedCompanies = [];

        for (const comp of companyInputs) {
            let foundCompany = null;

            if (mongoose.isValidObjectId(comp)) {
                foundCompany = await Company.findById(comp);
            } else {
                const name = String(comp).trim();
                foundCompany = await Company.findOne({
                    company: { $regex: `^${escapeRegExp(name)}$`, $options: "i" }
                });
            }

            if (foundCompany) resolvedCompanies.push(foundCompany);
        }

        if (resolvedCompanies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching companies found.",
            });
        }

        // Collect all question IDs from all matched companies
        const allQuestionIds = resolvedCompanies.flatMap(c => c.questions);

        if (allQuestionIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Company found but has no questions.",
                data: [],
            });
        }

        // Fetch all questions belonging to these companies
        const questions = await Question.find({
            _id: { $in: allQuestionIds }
        })
            .populate("company", "company company_img _id")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            companyCount: resolvedCompanies.length,
            totalQuestions: questions.length,
            companies: resolvedCompanies.map(c => ({
                _id: c._id,
                company: c.company,
                company_img: c.company_img,
                questionCount: c.questions.length,
            })),
            data: questions,
        });
    } catch (error) {
        console.error("Error in retrieveQuestionsCompanyWise:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving company-wise questions: " + error.message,
        });
    }
};

export const getAllCompanyNames = async (req, res) => {
    try {
        const companies = await Company.find({})
            .select("company -_id")   // ONLY return company name
            .sort({ company: 1 })     // alphabetical
            .lean();

        return res.status(200).json({
            success: true,
            total: companies.length,
            data: companies.map(c => c.company),
        });
    } catch (error) {
        console.error("Error retrieving company names:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving company names: " + error.message,
        });
    }
};


// helper
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
