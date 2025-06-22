import Quizz from "../models/quizzModel.js";4
import QuizResult from "../models/quizResult.js";

// get all quizzes
export const getQuizzes = async (req,res)=>{
  try {
    const quizzes = await Quizz.find({});

    if(!quizzes || quizzes.length === 0){
      return res.status(200).json({message:'No Quizzes available at the moment'});
    }

    res.status(200).json(quizzes);

  } catch (error) {
    res.status(500).json({error:error.message || 'internal server error'});
  }
}

// post a quizz
export const postQuizz = async (req,res) => {
  const {question,answers,correctAnswer} = req.body;

  if(!question || !correctAnswer || answers.length < 1){
    return res.status(400).json({error:'All fields are required'});
  }

  try {
    const quizz = await Quizz.create({
      question,
      answers,
      correctAnswer
    });

    res.status(201).json({message:'Quizz added successfully', quizz});
    
  } catch (error) {
    res.status(500).json({error:error.message || 'internal server error'});
  }
}

// count correct answers
export const countCorrectAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Answers are required and must be an array" });
    }

    let correctCount = 0;

    // Loop through each answer provided
    for (const ans of answers) {
      const { quizId, answer } = ans;
      const quiz = await Quizz.findById(quizId);
      if (quiz && quiz.correctAnswer === answer) {
        correctCount++;
      }
    }
    
    res.status(200).json({ correctCount });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// delete quizzes
export const deleteQuizz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quizz.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update a quiz by ID
export const updateQuizz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answers, correctAnswer } = req.body;

    // Ensure at least one field is provided for the update action
    if (!question && !answers && !correctAnswer) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    const updatedQuiz = await Quizz.findByIdAndUpdate(
      id,
      { question, answers, correctAnswer },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// STARTS HERE

// Submit quiz answers
export const submitQuizAnswers = async (req, res) => {
  try {
    const { answers } = req.body;
    const user = req.user;

    // Validate input
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Answers array required" });
    }

    // Get all question IDs at once
    const questionIds = answers.map(a => a.quizId);
    const questions = await Quizz.find({ _id: { $in: questionIds } });

    // Create question map for quick lookup
    const questionMap = {};
    questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    // Calculate results
    let score = 0;
    const detailedAnswers = [];

    for (const answer of answers) {
      const quiz = questionMap[answer.quizId];
      
      if (!quiz) {
        detailedAnswers.push({
          quizId: answer.quizId,
          error: "Question not found"
        });
        continue;
      }

      const isCorrect = quiz.correctAnswer === answer.answer;
      if (isCorrect) score++;

      detailedAnswers.push({
        questionId: quiz._id,
        userAnswer: answer.answer,
        correctAnswer: quiz.correctAnswer,
        isCorrect
      });
    }

    console.log(user);

    // Save results
    const quizResult = await QuizResult.create({
      userId: user.id,
      name: user.name,
      surname: user.surname,
      score,
      total: answers.length,
      answers: detailedAnswers
    });

    // Send response
    res.status(200).json({
      userId: user.id,
      name: user.name,
      surname: user.surname,
      score,
      total: answers.length,
      percentage: Math.round((score / answers.length) * 100),
      timestamp: quizResult.createdAt
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error processing quiz submission',
      error: error.message
    });
  }
};

// get all quizz results
export const getResults = async (req,res) => {
  try {
    const results = await QuizResult.find({});

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({error:"Internal Server error"})
  }
}