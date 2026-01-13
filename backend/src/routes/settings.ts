import { Router } from 'express';
import { getSettings, updateSetting, updateSettings } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public (read-only for some settings? No, usually public needs specific endpoint or we assume they are baked into frontend build. 
// But "Promo Banner" is dynamic. So we might need a public endpoint for specific public settings.)

// Let's make a public endpoint for specific keys if needed, but for now let's just protect everything and open up a specific public route later if needed.
// Actually, app.js logic fetched "initial state" which included config.
// So we probably need a public "initial-state" endpoint.

// For now, let's just standard CRUD.

// Protected routes
router.get('/', getSettings); // Helper to get everything (admin)
router.post('/', authenticate, updateSetting); // Single update
router.put('/', authenticate, updateSettings); // Bulk update

// Public route for frontend to fetch config (Banner, Logo, etc.)
router.get('/public', getSettings); // For now simply return all, or we could filter sensitive data if any.

export default router;
