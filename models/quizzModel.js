import mongoose from "mongoose";

const Schema = mongoose.Schema;

const quizzSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answers: [
    {
      type: String,
      required: true
    }
  ],
  correctAnswer: {
    type: String,
    required: true
  }
},{timestamps:true});

const Quizz = mongoose.model('Quizz',quizzSchema);

export default Quizz;