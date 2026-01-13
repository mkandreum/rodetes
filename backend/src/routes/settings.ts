import { Router } from 'express';
import { getSettings, updateSetting, updateSettings, uploadLogo } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Protected routes
router.get('/', getSettings); // Helper to get everything (admin)
router.post('/', authenticate, updateSetting); // Single update
router.put('/', authenticate, updateSettings); // Bulk update

// Upload logo (protected)
router.post('/upload-logo', authenticate, (req, res, next) => {
    req.body.uploadType = 'logos';
    next();
}, upload.single('logo'), uploadLogo);

// Public route for frontend to fetch config (Banner, Logo, etc.)
router.get('/public', getSettings);

export default router;
