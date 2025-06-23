import express from "express";
import { countCorrectAnswers, deleteQuizz, getMyResults, getQuizzes,getResults,postQuizz, submitQuizAnswers, updateQuizz } from "../controllers/quizzController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// get quiz results
router.get('/results',getResults);

// Protected
router.use(requireAuth);

// get all quizzes
router.get('/',getQuizzes);

router.post('/', postQuizz);
router.post('/submit', submitQuizAnswers);

// get user results
router.get('/user-results',getMyResults);

// update quizzes
router.patch('/',updateQuizz);

// delete quizzes
router.delete('/',deleteQuizz);

// count correct answers
router.post('/correct-count',countCorrectAnswers);


export default router;