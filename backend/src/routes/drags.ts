import { Router } from 'express';
import {
    getAllDrags,
    getDragById,
    createDrag,
    updateDrag,
    deleteDrag,
    uploadImage
} from '../controllers/dragsController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public
router.get('/', getAllDrags);
router.get('/:id', getDragById);

// Admin
router.post('/', authenticate, createDrag);
router.put('/:id', authenticate, updateDrag);
router.delete('/:id', authenticate, deleteDrag);

// Upload image
router.post('/upload-image', authenticate, (req, res, next) => {
    req.body.uploadType = 'drags';
    next();
}, upload.single('image'), uploadImage);

export default router;
