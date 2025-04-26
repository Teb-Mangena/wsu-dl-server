import Document from "../models/documetModel.js"
import uploadFromBuffer from '../lib/cloudinary.js'

// post document
export const postDocument = async (req, res) => {
  const { topic, content, link } = req.body;
  const image = req.file.buffer;

  // Validate required fields
  if (!image) {
    return res.status(400).json({ error: 'Image file is required.' });
  }
  if (!topic || !content || !link) {
    return res.status(400).json({ error: 'Topic, Contents and link are required.' });
  }

  try {
    // Upload image buffer from request to Cloudinary
    const uploadResult = await uploadFromBuffer(image);

    const newDocument = new Document({
      topic,
      content,
      link,
      image: uploadResult.secure_url
    });

    // Save the new book to MongoDB
    await newDocument.save();

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// get document
export const getDocument = async (req,res) => {
  
  try {

    const documents = await Document.find({}).sort({createdAt: -1});

    if(!documents || documents.length <= 0){
      return res.status(404).json({error:'Documents are currently unavailable'});
    }

    res.status(200).json(documents);

  } catch (error) {
    res.status(500).json({error:error.messsage || 'Internal server error' });
  }
}