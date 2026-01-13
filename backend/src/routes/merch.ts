import { Router } from 'express';
import {
    getMerchItems,
    getMerchItemById,
    createMerchItem,
    updateMerchItem,
    deleteMerchItem,
    uploadImage
} from '../controllers/merchController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public
router.get('/', getMerchItems);
router.get('/:id', getMerchItemById);

// Admin
router.post('/', authenticate, createMerchItem);
router.put('/:id', authenticate, updateMerchItem);
router.delete('/:id', authenticate, deleteMerchItem);

// Upload image
router.post('/upload-image', authenticate, (req, res, next) => {
    req.body.uploadType = 'merch';
    next();
}, upload.single('image'), uploadImage);

export default router;
