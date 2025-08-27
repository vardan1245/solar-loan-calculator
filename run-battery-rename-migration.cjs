const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.ylmcwkabyqvgdrbnunri:DBpasswordforCRMTIAMAT@aws-0-eu-north-1.pooler.supabase.com:6543/postgres'
});

async function runMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Starting battery table rename migration...');
        
        // Read the migration SQL file
        const migrationPath = path.join(__dirname, 'rename-accumulator-to-battery.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('📖 Migration SQL loaded successfully');
        
        // Execute the migration
        console.log('⚡ Executing migration...');
        await client.query(migrationSQL);
        
        console.log('✅ Migration completed successfully!');
        
        // Verify the table was renamed
        const verifyResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'battery_options'
        `);
        
        if (verifyResult.rows.length > 0) {
            console.log('✅ Table verification: battery_options table exists');
        } else {
            console.log('❌ Table verification failed: battery_options table not found');
        }
        
        // Check if old table still exists
        const oldTableResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'accumulator_options'
        `);
        
        if (oldTableResult.rows.length === 0) {
            console.log('✅ Old table verification: accumulator_options table successfully removed');
        } else {
            console.log('⚠️  Old table verification: accumulator_options table still exists');
        }
        
        // Show sample data from new table
        const sampleDataResult = await client.query(`
            SELECT id, name, brand, model, capacity_kwh, voltage, price, chemistry
            FROM battery_options 
            LIMIT 3
        `);
        
        console.log('📊 Sample data from battery_options table:');
        sampleDataResult.rows.forEach((row, index) => {
            console.log(`  ${index + 1}. ${row.brand} ${row.model} - ${row.capacity_kwh}kWh - ${row.price} AMD`);
        });
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('📋 Summary:');
        console.log('  - accumulator_options → battery_options');
        console.log('  - All indexes renamed');
        console.log('  - Trigger and function renamed');
        console.log('  - Table comments updated');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the migration
runMigration().catch(console.error);
