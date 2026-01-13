import { Router } from 'express';
import { getAllTickets, createTicket, scanTicket, getGiveawayWinner } from '../controllers/ticketsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public (Purchase)
router.post('/', createTicket);

// Admin / Scanner (Protected)
router.get('/', authenticate, getAllTickets);
router.post('/scan', authenticate, scanTicket);
router.get('/giveaway/:event_id', authenticate, getGiveawayWinner);

export default router;
