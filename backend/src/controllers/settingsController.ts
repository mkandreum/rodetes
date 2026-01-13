import { Request, Response } from 'express';
import pool from '../models/db';
import { getFileUrl } from '../middleware/uploadMiddleware';

// Get all settings
export const getSettings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT key, value FROM app_config');
        const settings: Record<string, any> = {};

        result.rows.forEach(row => {
            // Try to parse JSON values, otherwise keep as string
            try {
                settings[row.key] = JSON.parse(row.value);
            } catch {
                settings[row.key] = row.value;
            }
        });

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

// Update a specific setting
export const updateSetting = async (req: Request, res: Response) => {
    const { key, value } = req.body;

    if (!key) {
        return res.status(400).json({ message: 'Key is required' });
    }

    try {
        // Store as string (stringify only if object/array, but we assume client sends appropriate format, usually string or serialized JSON)
        // Actually, let's always stringify objects, but keep strings as strings if possible or standard consistency.
        // The safest is to stringify anything that isn't a string.

        let valueStore = value;
        if (typeof value !== 'string') {
            valueStore = JSON.stringify(value);
        }

        await pool.query(
            `INSERT INTO app_config (key, value) 
       VALUES ($1, $2) 
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
            [key, valueStore]
        );

        res.json({ message: 'Setting updated successfully', key, value });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Error updating setting' });
    }
};

// Update multiple settings at once
export const updateSettings = async (req: Request, res: Response) => {
    const settings = req.body; // Expect key-value object

    try {
        const queries = Object.entries(settings).map(([key, value]) => {
            let valueStore = value;
            if (typeof value !== 'string') {
                valueStore = JSON.stringify(value);
            }
            return pool.query(
                `INSERT INTO app_config (key, value) 
                 VALUES ($1, $2) 
                 ON CONFLICT (key) 
                 DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
                [key, valueStore]
            );
        });

        await Promise.all(queries);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
}

// Upload logo file
export const uploadLogo = async (req: Request, res: Response) => {
    try {
        console.log('--- uploadLogo Controller ---');
        console.log('File received:', req.file ? req.file.filename : 'None');
        console.log('Body:', req.body);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { logoType } = req.body; // 'app' or 'ticket'
        const fileUrl = getFileUrl(req);

        // Update the corresponding setting
        const key = logoType === 'ticket' ? 'ticketLogoUrl' : 'appLogoUrl';
        console.log('Updating setting:', key, 'with URL:', fileUrl);

        await pool.query(
            `INSERT INTO app_config (key, value) 
             VALUES ($1, $2) 
             ON CONFLICT (key) 
             DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
            [key, fileUrl]
        );

        res.json({
            message: 'Logo uploaded successfully',
            url: fileUrl
        });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ message: 'Error uploading logo' });
    }
};
