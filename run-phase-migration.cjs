const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:DBpasswordforCRMTIAMAT@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        console.log('🚀 Starting phase column migration...');
        
        // Read the migration SQL file
        const migrationSQL = fs.readFileSync(path.join(__dirname, 'add-phase-column-to-inverters.sql'), 'utf8');
        
        // Execute the migration
        console.log('📝 Executing migration...');
        await pool.query(migrationSQL);
        
        console.log('✅ Phase column migration completed successfully!');
        
        // Verify the changes
        console.log('🔍 Verifying changes...');
        const result = await pool.query('SELECT id, name, brand, kw, type, phase FROM inverter_options LIMIT 5');
        
        console.log('📊 Sample data after migration:');
        result.rows.forEach(row => {
            console.log(`  ID: ${row.id}, Name: ${row.name}, Brand: ${row.brand}, Power: ${row.kw}kW, Type: ${row.type}, Phase: ${row.phase}`);
        });
        
        // Show total count
        const countResult = await pool.query('SELECT COUNT(*) as total FROM inverter_options');
        console.log(`📈 Total inverters: ${countResult.rows[0].total}`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await pool.end();
    }
}

// Run the migration
runMigration();
