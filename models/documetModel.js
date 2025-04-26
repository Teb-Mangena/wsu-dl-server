import mongoose from "mongoose";

const Schema = mongoose.Schema;

const documentSchema = new Schema({
  topic: {
    type:String,
    required: true
  },
  image: {
    type: String
  },
  content: {
    type: String,
    required:true
  },
  link: {
    type: String,
    required:true
  }
},{timestamps:true})

const Document = mongoose.model('Document',documentSchema);

export default Document;