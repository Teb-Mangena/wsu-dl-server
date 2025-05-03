import express from 'express';
import { getDocument, postDocument } from "../controllers/documentController.js";
import { upload } from '../lib/cloudinary.js';

const router = express.Router();

// post document
router.post('/', 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]), 
  postDocument
);

// get document
router.get('/',getDocument);


export default router;