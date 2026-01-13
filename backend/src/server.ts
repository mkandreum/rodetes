import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import Routes
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import dragRoutes from './routes/drags';
import merchRoutes from './routes/merch';
import ticketRoutes from './routes/tickets';
import salesRoutes from './routes/sales';
import galleryRoutes from './routes/gallery';
import settingsRoutes from './routes/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed Admin User
import seedAdminUser from './scripts/seed';
seedAdminUser().catch(err => console.error('Seed execution failed:', err));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend Static Files
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/drags', dragRoutes);
app.use('/api/merch', merchRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Handle React Routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Debug Endpoint to check DB connection
import pool from './models/db';
app.get('/api/debug/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as now, current_database() as db, current_user as user');
        client.release();
        res.json({
            status: 'success',
            connection: 'established',
            info: result.rows[0],
            env: {
                DB_URL: process.env.DATABASE_URL ? 'Defined' : 'Undefined'
            }
        });
    } catch (error: any) {
        console.error('DB Connection Failed:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            detail: error
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
