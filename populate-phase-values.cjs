const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:DBpasswordforCRMTIAMAT@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function populatePhaseValues() {
    try {
        console.log('🚀 Starting phase value population...');
        
        // Read the SQL file
        const sqlFile = fs.readFileSync(path.join(__dirname, 'populate-phase-values.sql'), 'utf8');
        
        // Execute the SQL
        console.log('📝 Populating phase values...');
        await pool.query(sqlFile);
        
        console.log('✅ Phase values populated successfully!');
        
        // Verify the changes
        console.log('🔍 Verifying changes...');
        const result = await pool.query('SELECT id, name, brand, kw, type, phase FROM inverter_options ORDER BY kw LIMIT 10');
        
        console.log('📊 Sample data after phase population:');
        result.rows.forEach(row => {
            console.log(`  ID: ${row.id}, Name: ${row.name}, Brand: ${row.brand}, Power: ${row.kw}kW, Type: ${row.type}, Phase: ${row.phase}`);
        });
        
        // Show phase distribution
        const phaseResult = await pool.query('SELECT phase, COUNT(*) as count FROM inverter_options GROUP BY phase');
        console.log('📈 Phase distribution:');
        phaseResult.rows.forEach(row => {
            console.log(`  ${row.phase}: ${row.count} inverters`);
        });
        
    } catch (error) {
        console.error('❌ Phase population failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await pool.end();
    }
}

// Run the population
populatePhaseValues();
