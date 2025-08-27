const fs = require('fs');
const path = require('path');

// Database configuration
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Create database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runAccumulatorMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Starting accumulator options table migration...');
        
        // Read the migration SQL file
        const migrationPath = path.join(__dirname, 'create-accumulator-options-table.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('📖 Migration SQL loaded successfully');
        console.log('📊 Executing migration...');
        
        // Execute the migration
        const result = await client.query(migrationSQL);
        
        console.log('✅ Migration completed successfully!');
        console.log(`📈 Executed ${result.length || 1} SQL statements`);
        
        // Verify the table was created
        console.log('\n🔍 Verifying table creation...');
        const tableCheck = await client.query(`
            SELECT 
                table_name, 
                column_name, 
                data_type, 
                is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'accumulator_options' 
            ORDER BY ordinal_position
        `);
        
        if (tableCheck.rows.length > 0) {
            console.log('✅ accumulator_options table created successfully');
            console.log(`📋 Table has ${tableCheck.rows.length} columns`);
            
            // Show table structure
            console.log('\n📊 Table Structure:');
            tableCheck.rows.forEach(row => {
                console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
            });
        } else {
            console.log('❌ Table creation verification failed');
        }
        
        // Check sample data
        console.log('\n🔍 Checking sample data...');
        const dataCheck = await client.query(`
            SELECT 
                id, 
                name, 
                brand, 
                model, 
                capacity_kwh, 
                voltage, 
                price, 
                chemistry, 
                warranty_years 
            FROM accumulator_options 
            ORDER BY capacity_kwh 
            LIMIT 5
        `);
        
        if (dataCheck.rows.length > 0) {
            console.log(`✅ Sample data loaded successfully (${dataCheck.rows.length} records)`);
            console.log('\n📋 Sample Records:');
            dataCheck.rows.forEach(row => {
                console.log(`  - ${row.brand} ${row.model}: ${row.capacity_kwh}kWh, ${row.voltage}V, ${row.price.toLocaleString()} AMD (${row.chemistry})`);
            });
        } else {
            console.log('❌ Sample data verification failed');
        }
        
        // Check total count
        const totalCount = await client.query('SELECT COUNT(*) as total FROM accumulator_options');
        console.log(`\n📊 Total accumulator options: ${totalCount.rows[0].total}`);
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('  1. Test the frontend by selecting "Hybrid" inverter type');
        console.log('  2. Verify accumulator selection appears');
        console.log('  3. Test auto and manual selection modes');
        console.log('  4. Verify costs are included in calculations');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Try to provide helpful error information
        if (error.code === '23505') {
            console.error('💡 This error suggests a duplicate key constraint violation');
            console.error('   The table or some data might already exist');
        } else if (error.code === '42P07') {
            console.error('💡 This error suggests the table already exists');
            console.error('   You can safely ignore this or run the rollback script first');
        }
        
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the migration
runAccumulatorMigration().catch(console.error);
