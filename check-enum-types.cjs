const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:DBpasswordforCRMTIAMAT@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function checkEnumTypes() {
    try {
        console.log('🔍 Checking enum types in database...');
        
        // Check what enum types exist
        const enumResult = await pool.query(`
            SELECT t.typname, e.enumlabel
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typtype = 'e'
            ORDER BY t.typname, e.enumsortorder;
        `);
        
        console.log('📊 Enum types found:');
        enumResult.rows.forEach(row => {
            console.log(`  Type: ${row.typname}, Value: ${row.enumlabel}`);
        });
        
        // Check the inverter_options table structure
        const tableResult = await pool.query(`
            SELECT column_name, data_type, udt_name, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'inverter_options' 
            AND column_name = 'phase'
            ORDER BY ordinal_position;
        `);
        
        console.log('📋 Phase column structure:');
        tableResult.rows.forEach(row => {
            console.log(`  Column: ${row.column_name}, Type: ${row.data_type}, UDT: ${row.udt_name}, Nullable: ${row.is_nullable}, Default: ${row.column_default}`);
        });
        
    } catch (error) {
        console.error('❌ Check failed:', error.message);
    } finally {
        await pool.end();
    }
}

// Run the check
checkEnumTypes();
