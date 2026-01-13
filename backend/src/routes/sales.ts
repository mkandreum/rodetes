import { Router } from 'express';
import { getAllSales, createSale, deliverSale } from '../controllers/merchSalesController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public (Purchase)
router.post('/purchase', createSale);

// Admin (Protected)
router.get('/', authenticate, getAllSales);
router.post('/deliver', authenticate, deliverSale);

export default router;
