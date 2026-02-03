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

async function runMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Starting Sales Office Role Migration...\n');
        
        // Read the migration SQL file
        const migrationSQL = fs.readFileSync(join(__dirname, 'add-sales-office-role.sql'), 'utf8');
        
        console.log('📝 Executing migration SQL...');
        
        // Execute the migration
        await client.query(migrationSQL);
        
        console.log('✅ Migration completed successfully!\n');
        
        // Verify the roles
        console.log('🔍 Verifying roles in database...');
        const result = await client.query(`
            SELECT role, COUNT(*) as count 
            FROM admin_users 
            GROUP BY role 
            ORDER BY role
        `);
        
        console.log('\n📊 Current role distribution:');
        console.log('─'.repeat(45));
        result.rows.forEach(row => {
            console.log(`│ ${row.role.padEnd(20)} │ ${String(row.count).padStart(5)} users │`);
        });
        console.log('─'.repeat(45));
        
        console.log('\n✨ Sales Office role has been added successfully!');
        console.log('\n📝 Available roles:');
        console.log('   • admin        - Full administrative access');
        console.log('   • sales_office - Sales office staff access');
        console.log('   • user         - Regular user access');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('\nError details:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the migration
runMigration().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
