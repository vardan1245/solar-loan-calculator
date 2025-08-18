// Script to check the structure of panel_options table
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkTableStructure() {
    try {

        // Check if table exists
        const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'panel_options'
            );
        `;
        
        const tableExists = await pool.query(tableExistsQuery);

        if (tableExists.rows[0].exists) {
            // Get table structure
            const structureQuery = `
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'panel_options' 
                ORDER BY ordinal_position;
            `;
            
            const structure = await pool.query(structureQuery);
            
            structure.rows.forEach(row => {
                
            });
            
            // Check row count
            const countQuery = 'SELECT COUNT(*) as total FROM panel_options';
            const count = await pool.query(countQuery);

            if (count.rows[0].total > 0) {
                // Show sample data
                const sampleQuery = 'SELECT * FROM panel_options LIMIT 1';
                const sample = await pool.query(sampleQuery);
                
                console.log(JSON.stringify(sample.rows[0], null, 2));
            }
        }
        
    } catch (error) {
        console.error('❌ Error checking table structure:', error);
    } finally {
        await pool.end();
    }
}

// Run the script
checkTableStructure();
