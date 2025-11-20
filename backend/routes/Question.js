import express from 'express';
const router=express.Router();


import {addQuestions,retrieveQuestionsCompanyWise,getAllCompanyNames} from '../controllers/Question.js'

router.post("/addQuestions",addQuestions);
router.post("/retrieveQuestionsCompanyWise",retrieveQuestionsCompanyWise);
router.post("/getAllCompanyNames",getAllCompanyNames);


export default router;