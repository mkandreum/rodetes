import fs from 'fs';
import path from 'path';
import pool from '../models/db';

const verifyDeployment = async () => {
    console.log('🔍 Starting Deployment Verification...');

    // 1. Verify Database Connection
    try {
        console.log('📡 Testing Database Connection...');
        const client = await pool.connect();
        const res = await client.query('SELECT NOW() as now');
        console.log(`✅ Database Connected! Time: ${res.rows[0].now}`);
        client.release();
    } catch (error: any) {
        console.error('❌ Database Connection Failed:', error.message);
        process.exit(1);
    }

    // 2. Verify Uploads Directory
    try {
        console.log('📂 Verifying Uploads Directory...');
        const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

        if (!fs.existsSync(baseUploadDir)) {
            console.log(`⚠️ Uploads directory does not exist at: ${baseUploadDir}`);
            console.log('🛠 Creating uploads directory...');
            fs.mkdirSync(baseUploadDir, { recursive: true });
        }

        // Test Write Permission
        const testFile = path.join(baseUploadDir, 'test-write.txt');
        fs.writeFileSync(testFile, 'Write test successful');
        fs.unlinkSync(testFile);
        console.log(`✅ Uploads directory is writable: ${baseUploadDir}`);

    } catch (error: any) {
        console.error('❌ Uploads Directory Verification Failed:', error.message);
        process.exit(1);
    }

    console.log('🎉 Deployment Verification Passed!');
    process.exit(0);
};

verifyDeployment();
