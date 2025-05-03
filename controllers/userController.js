import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import sendEmail from "../utils/emailService.js";

// create a resuable token
const createToken = (id) => {
  return jwt.sign({id},process.env.SECRET,{expiresIn:'3d'});
}

// login user
export const loginUser = async (req,res) => {
  const {email,password} = req.body;

  try {
    const user = await User.login(email,password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({
      email,
      name:user.name,
      lastName:user.lastName,
      role:user.role,
      token
    });

  } catch (error) {
    res.status(400).json({error:error.message || 'Invalid email or password'});
  }
}

// Signup user
export const signupUser = async (req, res) => {
  const { name, lastName, email, password, role } = req.body;

  try {
    // Call the static signup method
    const user = await User.signup(name, lastName, email, password, role);

    // Send welcome email
    await sendEmail(
      email,
      'Congratulations on your Selection! 🎉',
      `Hi ${lastName} ${name},\n\nCongratulations!!! We are thrilled to announce that you have been selected to take part in the WSU Digital Learning Platform as ${role === "admin" ? "an admin role" : "a student"}.\n\nTo get started, please use your email (${email}) and the following password (${password}) to log in.\n https://wsu-digital-learn.vercel.app/ \n\nCheers,\nWSU Digital learning platform`
    );

    // create token
    const token = createToken(user._id);

    res.status(201).json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        token 
      },message:'learner registered successfully'
    });

  } catch (error) {
    res.status(400).json({ error: error.message || 'Server error'});
  }
};


// get all user for the admin
export const getUsers = async (req,res) => {
  try{
    const users = await User.find({}).sort({createdAt:-1});

    if(!users){
      return res.status(400).json({message:"No users found"});
    }

    res.status(200).json(users);

  } catch (error){
    res.status(500).json({error:error.message || "Server Error"});
  }
}

// Get a single user for the admin
export const getUser = async (req,res) => {
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({error:"Invalid user id"});
  }

  try{
    const user = await User.findById(id);

    if(!user){
      return res.status(400).json({error:"User was never found"});
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

// Delete a user
export const deleteUser = async (req,res) => {
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({error:"Invalid user id"});
  }

  try{
    const user = await User.findOneAndDelete(id);

    if(!user){
      return res.status(400).json({error:"User was never found"});
    }

    res.status(200).json({message:"user deleted successfully",user});

  } catch (error) {
    res.status(500).json({error:error.message});
  }
}