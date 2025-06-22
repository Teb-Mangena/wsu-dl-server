import mongoose from "mongoose";

const Schema = mongoose.Schema;

const quizResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Quizz",
      required: true
    },
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }]
}, { timestamps: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;