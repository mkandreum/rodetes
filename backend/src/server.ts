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

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
