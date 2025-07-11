import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

// import from routes
import userRoute from "./routes/userRoutes.js";
import quizzRoute from './routes/quizzRoute.js';
import documentRoute from './routes/documentRoute.js';

// configure dotenv
dotenv.config();

// create express app
const app = express();

// import from environment
const PORT = process.env.PORT || 5000;
const { DB } = process.env;

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// routes
app.use('/api/users',userRoute);
app.use('/api/documents',documentRoute);
app.use('/api/quizz',quizzRoute);

// connect to DB
mongoose.connect(DB)
  .then(()=>{
    // listen to port
    app.listen(PORT,()=>{
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err)=>{
    console.log(err);
  });