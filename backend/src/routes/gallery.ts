import { Router } from 'express';
import { getGalleries, addPhoto, deletePhoto } from '../controllers/galleryController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public
router.get('/', getGalleries);

// Admin
router.post('/', authenticate, upload.single('image'), addPhoto);
router.delete('/:id', authenticate, deletePhoto);

export default router;
