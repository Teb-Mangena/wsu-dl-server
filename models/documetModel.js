import mongoose from "mongoose";

const Schema = mongoose.Schema;

const documentSchema = new Schema({
  topic: {
    type:String,
    required: true
  },
  image: {
    url: String,
    publicId: String
  },
  pdf: {
    url: String,
    publicId: String,
    fileName: String,
    size: Number
  },
  content: {
    type: String,
    required:true
  }
},{timestamps:true})

const Document = mongoose.model('Document',documentSchema);

export default Document;