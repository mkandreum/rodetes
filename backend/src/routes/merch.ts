import { Router } from 'express';
import {
    getMerchItems,
    getMerchItemById,
    createMerchItem,
    updateMerchItem,
    deleteMerchItem
} from '../controllers/merchController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getMerchItems);
router.get('/:id', getMerchItemById);

// Admin
router.post('/', authenticate, createMerchItem);
router.put('/:id', authenticate, updateMerchItem);
router.delete('/:id', authenticate, deleteMerchItem);

export default router;
