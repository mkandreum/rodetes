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
        console.log('--- Upload Request ---');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('File field:', file.fieldname);

        // Take uploadType from header, query or body
        const uploadType = (req.headers['x-upload-type'] as string) || req.body.uploadType || 'general';
        const uploadPath = path.resolve(__dirname, '../../uploads', uploadType);

        console.log('Upload target path:', uploadPath);

        try {
            ensureDir(uploadPath);
            cb(null, uploadPath);
        } catch (err: any) {
            console.error('Directory creation failed:', err);
            cb(err, '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        console.log('Generated filename:', uniqueName);
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
