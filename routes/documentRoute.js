import express from 'express';
import { getDocument, postDocument } from "../controllers/documentController.js";
import { upload } from '../lib/cloudinary.js';

const router = express.Router();

// post document
router.post('/', upload.single('image'),postDocument);

// get document
router.get('/',getDocument);


export default router;