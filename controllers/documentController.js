import Document from "../models/documetModel.js"
import uploadFromBuffer from '../lib/cloudinary.js'

// post document
export const postDocument = async (req, res) => {
  const { topic, content } = req.body;
  const imageFile = req.files?.image?.[0];
  const pdfFile = req.files?.pdf?.[0];

  // Validate required fields
  if (!topic || !content) {
    return res.status(400).json({ error: 'Topic, Contents are required.' });
  }

  try {
    let imageData = null;
    let pdfData = null;

    // Process image
    if (imageFile) {
      const imageResult = await uploadFromBuffer(imageFile.buffer, {
        resourceType: 'image'
      });
      imageData = {
        url: imageResult.secure_url,
        publicId: imageResult.public_id
      };
    }

    // Process PDF with metadata
    if (pdfFile) {
      const pdfResult = await uploadFromBuffer(pdfFile.buffer, {
        resourceType: 'raw',
        format: 'pdf',
        fileName: pdfFile.originalname.replace(/\.[^/.]+$/, "") // Remove extension
      });
      
      pdfData = {
        url: pdfResult.secure_url,
        publicId: pdfResult.public_id,
        fileName: pdfFile.originalname,
        size: pdfResult.bytes
      };
    }

    const newDocument = new Document({
      topic,
      content,
      image: imageData,
      pdf: pdfData
    });

    await newDocument.save();
    
    res.status(201).json({
      ...newDocument.toObject(),
      pdf: {
        ...newDocument.pdf,
        downloadUrl: `${pdfData.url}?dl=${encodeURIComponent(pdfData.fileName)}.pdf`
      }
    });

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