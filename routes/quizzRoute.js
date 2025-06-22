import express from "express";
import { countCorrectAnswers, deleteQuizz, getQuizzes,postQuizz, submitQuizAnswers, updateQuizz } from "../controllers/quizzController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// Protected
router.use(requireAuth);

// get all quizzes
router.get('/',getQuizzes);

router.post('/', postQuizz);
router.post('/submit', submitQuizAnswers);

// update quizzes
router.patch('/',updateQuizz);

// delete quizzes
router.delete('/',deleteQuizz);

// count correct answers
router.post('/correct-count',countCorrectAnswers);


export default router;