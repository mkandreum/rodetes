import pool, { query } from '../models/db';
import fs from 'fs';
import path from 'path';
import seedAdminUser from './seed';

const resetDb = async () => {
    try {
        console.log('Starting Database Reset...');

        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema.sql...');
        await query(schema);
        console.log('Schema applied successfully.');

        console.log('Running Seed...');
        await seedAdminUser();
        console.log('Seed completed.');

        console.log('Database Reset Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Database Reset Failed:', error);
        process.exit(1);
    }
};

resetDb();
