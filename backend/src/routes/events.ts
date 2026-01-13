import { Router } from 'express';
import {
    getPublicEvents,
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadPoster
} from '../controllers/eventsController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.get('/', getPublicEvents);
router.get('/:id', getEventById);

// Admin routes (Protected)
router.get('/admin/all', authenticate, getAllEvents);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

// Upload poster
router.post('/upload-poster', authenticate, (req, res, next) => {
    req.body.uploadType = 'events';
    next();
}, upload.single('poster'), uploadPoster);

export default router;
