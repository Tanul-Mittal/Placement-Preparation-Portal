import express from 'express';
const router=express.Router();


import {addQuestions} from '../controllers/Question.js'

router.post("/addQuestions",addQuestions);


export default router;