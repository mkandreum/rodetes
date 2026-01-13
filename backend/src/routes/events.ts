import { Router } from 'express';
import {
    getPublicEvents,
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPublicEvents);
router.get('/:id', getEventById);

// Admin routes (Protected)
router.get('/admin/all', authenticate, getAllEvents);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
