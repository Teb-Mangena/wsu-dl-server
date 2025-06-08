import express from "express";
import { countCorrectAnswers, deleteQuizz, getQuizzes,postQuizz, updateQuizz } from "../controllers/quizzController.js";

const router = express.Router();

// get all quizzes
router.get('/',getQuizzes);

// post quizzes
router.post('/',postQuizz)

// update quizzes
router.patch('/',updateQuizz);

// delete quizzes
router.delete('/',deleteQuizz);

// count correct answers
router.post('/correct-count',countCorrectAnswers);


export default router;