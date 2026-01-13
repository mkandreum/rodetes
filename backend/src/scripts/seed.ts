
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from '../models/db';

dotenv.config();

const seedAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping admin seed.');
        return;
    }

    const client = await pool.connect();

    try {
        // Check if admin exists
        const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

        if (checkRes.rowCount && checkRes.rowCount > 0) {
            console.log('✅ Admin user already exists.');
        } else {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(adminPassword, salt);

            await client.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
                [adminEmail, hash]
            );
            console.log(`✅ Admin user created: ${adminEmail}`);
        }
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    } finally {
        client.release();
    }
};

export default seedAdminUser;
