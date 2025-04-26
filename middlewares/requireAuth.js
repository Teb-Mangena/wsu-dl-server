import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const requireAuth = async (req,res,next) => {
  // verify authentication
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(401).json({error:'Authentication is required'});
  }

  // get token
  const token = authorization.split(' ')[1];

  try {
    // verify token
    const {_id} = jwt.verify(token,process.env.SECRET);

    // attach user
    req.user = await User.findById(_id).select('_id');

    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({error:'Request is not authorized'});
  }
}

export default requireAuth;