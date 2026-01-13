import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';

// Import Routes
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import dragRoutes from './routes/drags';
import merchRoutes from './routes/merch';
import ticketRoutes from './routes/tickets';
import salesRoutes from './routes/sales';
import galleryRoutes from './routes/gallery';
import settingsRoutes from './routes/settings';

// Database
import pool from './models/db';
import seedAdminUser from './scripts/seed';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Database Initialization
const initDb = async () => {
    try {
        console.log('🔍 Checking database schema...');
        const client = await pool.connect();
        const res = await client.query("SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'");

        if (res.rowCount === 0) {
            console.log('⚠️  Database tables missing. Initializing schema...');
            const schemaPath = path.join(__dirname, './db/schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schema = fs.readFileSync(schemaPath, 'utf8');
                await client.query(schema);
                console.log('✅ Schema applied successfully.');
            } else {
                console.error('❌ schema.sql not found at', schemaPath);
                throw new Error('Schema file not found');
            }
        } else {
            console.log('✅ Database schema already exists.');
        }
        client.release();

        // Always run seed to ensure admin user exists
        console.log('🌱 Running seed...');
        await seedAdminUser();
        console.log('✅ Database initialization complete.');
    } catch (error) {
        console.error('❌ DB Initialization failed:', error);
        throw error;
    }
};

// Main server initialization
const startServer = async () => {
    // CRITICAL: Initialize DB BEFORE creating routes
    await initDb();

    const app = express();

    // Middleware
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

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

    // Debug Endpoint
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

    // Handle React Routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });

    // Global Error Handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('❌ Global Error:', err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

// Start the server
startServer().catch(err => {
    console.error('💥 Failed to start server:', err);
    process.exit(1);
});
