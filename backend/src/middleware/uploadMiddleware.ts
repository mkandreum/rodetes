import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get upload type from request body or default to 'general'
        const uploadType = req.body.uploadType || 'general';
        const uploadPath = path.join(__dirname, '../../uploads', uploadType);
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter
});

// Helper function to get file URL
export const getFileUrl = (filename: string, type: string): string => {
    return `/uploads/${type}/${filename}`;
};
