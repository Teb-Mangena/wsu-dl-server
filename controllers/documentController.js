import { v2 as cloudinary } from "cloudinary";
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

// delete a document
export const deleteOneDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the document first to get Cloudinary public IDs
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Array to hold Cloudinary deletion promises
    const deletionPromises = [];

    // Delete image from Cloudinary if exists
    if (document.image?.publicId) {
      deletionPromises.push(
        cloudinary.uploader.destroy(document.image.publicId)
          .catch(error => {
            console.error("Error deleting image:", error);
            // Continue even if deletion fails
          })
      );
    }

    // Delete PDF from Cloudinary if exists
    if (document.pdf?.publicId) {
      deletionPromises.push(
        cloudinary.uploader.destroy(document.pdf.publicId, { resource_type: 'raw' })
          .catch(error => {
            console.error("Error deleting PDF:", error);
            // Continue even if deletion fails
          })
      );
    }

    // Wait for all Cloudinary deletions to complete
    await Promise.all(deletionPromises);

    // Delete the document from MongoDB
    const deletedDocument = await Document.findByIdAndDelete(id);

    res.status(200).json({
      message: "Document deleted successfully",
      deletedDocument
    });

  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      message: "Server error while deleting document",
      error: error.message
    });
  }
};

// Add to your documentController.js
export const deleteAllDocs = async (req, res) => {
  try {
    // Get all documents first to cleanup Cloudinary files
    const allDocs = await Document.find({});
    
    // Delete files from Cloudinary
    const cloudinaryDeletions = allDocs.flatMap(doc => {
      const deletions = [];
      
      if (doc.image?.publicId) {
        deletions.push(
          cloudinary.uploader.destroy(doc.image.publicId, { resource_type: 'image' })
        );
      }
      
      if (doc.pdf?.publicId) {
        deletions.push(
          cloudinary.uploader.destroy(doc.pdf.publicId, { resource_type: 'raw' })
        );
      }
      
      return deletions;
    });

    await Promise.all(cloudinaryDeletions);
    
    // Delete all documents from MongoDB
    const deleteResult = await Document.deleteMany({});
    
    res.status(200).json({
      message: `Successfully deleted ${deleteResult.deletedCount} documents`,
      deletedCount: deleteResult.deletedCount
    });
    
  } catch (error) {
    console.error('Error deleting documents:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete documents',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};