import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Database connection - using Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupAdminUsersTable() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Setting up admin_users table...\n');
        
        // Read the SQL file
        const setupSQL = fs.readFileSync(join(__dirname, 'create-admin-users-table.sql'), 'utf8');
        
        console.log('📝 Executing SQL...');
        
        // Execute the setup
        await client.query(setupSQL);
        
        console.log('✅ Admin users table created successfully!\n');
        
        // Verify the table
        console.log('🔍 Verifying table structure...');
        const result = await client.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'admin_users'
            ORDER BY ordinal_position
        `);
        
        console.log('\n📊 Table structure:');
        console.log('─'.repeat(60));
        result.rows.forEach(row => {
            const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
            console.log(`│ ${row.column_name.padEnd(20)} │ ${(row.data_type + length).padEnd(30)} │`);
        });
        console.log('─'.repeat(60));
        
        console.log('\n✨ Setup completed successfully!');
        console.log('\n📝 Default admin user created:');
        console.log('   • Username: admin');
        console.log('   • Password: admin123 (⚠️ Change in production!)');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('\nError details:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the setup
setupAdminUsersTable().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
