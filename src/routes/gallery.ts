import { Router } from 'express';
import { getGalleries, addPhoto, deletePhoto } from '../controllers/galleryController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getGalleries);

// Admin
router.post('/', authenticate, addPhoto);
router.delete('/:id', authenticate, deletePhoto);

export default router;
