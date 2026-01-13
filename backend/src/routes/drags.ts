import { Router } from 'express';
import {
    getAllDrags,
    getDragById,
    createDrag,
    updateDrag,
    deleteDrag
} from '../controllers/dragsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getAllDrags);
router.get('/:id', getDragById);

// Admin
router.post('/', authenticate, createDrag);
router.put('/:id', authenticate, updateDrag);
router.delete('/:id', authenticate, deleteDrag);

export default router;
