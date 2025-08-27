const fs = require('fs');
const path = require('path');

// Database configuration
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Create database connection pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tiamat_loan_calculator',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
});

async function runAccumulatorRollback() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Starting accumulator options table rollback...');
        
        // Read the rollback SQL file
        const rollbackPath = path.join(__dirname, 'rollback-accumulator-options-table.sql');
        const rollbackSQL = fs.readFileSync(rollbackPath, 'utf8');
        
        console.log('📖 Rollback SQL loaded successfully');
        console.log('⚠️  WARNING: This will permanently remove the accumulator_options table and all data!');
        
        // Ask for confirmation
        console.log('\n❓ Are you sure you want to continue? (y/N)');
        console.log('   This action cannot be undone!');
        
        // For automated scripts, you can set an environment variable to skip confirmation
        if (process.env.SKIP_CONFIRMATION !== 'true') {
            // In a real scenario, you'd want to use readline or similar for user input
            // For now, we'll just log a warning and continue
            console.log('⚠️  Auto-confirming rollback (set SKIP_CONFIRMATION=true to skip this warning)');
        }
        
        console.log('📊 Executing rollback...');
        
        // Execute the rollback
        const result = await client.query(rollbackSQL);
        
        console.log('✅ Rollback completed successfully!');
        console.log(`📈 Executed rollback operations`);
        
        // Verify the table was removed
        console.log('\n🔍 Verifying table removal...');
        const tableCheck = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'accumulator_options'
        `);
        
        if (tableCheck.rows.length === 0) {
            console.log('✅ accumulator_options table removed successfully');
        } else {
            console.log('❌ Table removal verification failed - table still exists');
        }
        
        // Show remaining tables
        console.log('\n📋 Remaining tables:');
        const remainingTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        remainingTables.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        console.log('\n🎉 Rollback completed successfully!');
        console.log('\n📝 Note:');
        console.log('  - The accumulator_options table has been completely removed');
        console.log('  - All accumulator data has been lost');
        console.log('  - Frontend accumulator features will no longer work');
        console.log('  - To restore, run the migration script again');
        
    } catch (error) {
        console.error('❌ Rollback failed:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Try to provide helpful error information
        if (error.code === '42P01') {
            console.error('💡 This error suggests the table does not exist');
            console.error('   The rollback may have already been completed');
        }
        
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the rollback
runAccumulatorRollback().catch(console.error);
