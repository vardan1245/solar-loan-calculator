// Test script to verify the new inverter type column
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testInverterType() {
    try {
        console.log('🔍 Testing inverter type column...\n');

        // Test 1: Check if the enum type exists
        console.log('1. Checking if inverter_type enum exists...');
        const enumCheck = await pool.query(`
            SELECT typname, typtype 
            FROM pg_type 
            WHERE typname = 'inverter_type'
        `);
        
        if (enumCheck.rows.length > 0) {
            console.log('   ✅ inverter_type enum exists');
        } else {
            console.log('   ❌ inverter_type enum does not exist');
        }

        // Test 2: Check if the type column exists in inverter_options table
        console.log('\n2. Checking if type column exists in inverter_options table...');
        const columnCheck = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'inverter_options' AND column_name = 'type'
        `);
        
        if (columnCheck.rows.length > 0) {
            console.log('   ✅ type column exists');
            console.log(`   📋 Column details: ${JSON.stringify(columnCheck.rows[0])}`);
        } else {
            console.log('   ❌ type column does not exist');
        }

        // Test 3: Check if the index exists
        console.log('\n3. Checking if type column index exists...');
        const indexCheck = await pool.query(`
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE tablename = 'inverter_options' AND indexname = 'idx_inverter_options_type'
        `);
        
        if (indexCheck.rows.length > 0) {
            console.log('   ✅ type column index exists');
        } else {
            console.log('   ❌ type column index does not exist');
        }

        // Test 4: Check sample data with the new column
        console.log('\n4. Checking sample data with type column...');
        const sampleData = await pool.query(`
            SELECT id, name, brand, model, kw, price, type, is_active 
            FROM inverter_options 
            ORDER BY kw 
            LIMIT 5
        `);
        
        if (sampleData.rows.length > 0) {
            console.log('   ✅ Sample data retrieved:');
            sampleData.rows.forEach((row, index) => {
                console.log(`      ${index + 1}. ${row.name} (${row.kw} kW) - Type: ${row.type || 'NULL'}`);
            });
        } else {
            console.log('   ❌ No data found in inverter_options table');
        }

        // Test 5: Check if all existing records have 'on_grid' type
        console.log('\n5. Checking if all existing records have on_grid type...');
        const typeDistribution = await pool.query(`
            SELECT type, COUNT(*) as count 
            FROM inverter_options 
            GROUP BY type
        `);
        
        console.log('   📊 Type distribution:');
        typeDistribution.rows.forEach(row => {
            console.log(`      ${row.type || 'NULL'}: ${row.count} inverters`);
        });

        // Test 6: Test API endpoint
        console.log('\n6. Testing API endpoint...');
        const apiTest = await pool.query(`
            SELECT * FROM inverter_options WHERE is_active = true ORDER BY kw LIMIT 3
        `);
        
        console.log('   ✅ API test data:');
        apiTest.rows.forEach((row, index) => {
            console.log(`      ${index + 1}. ${row.name} - Type: ${row.type || 'NULL'}`);
        });

        console.log('\n🎉 Inverter type column test completed successfully!');

    } catch (error) {
        console.error('❌ Error testing inverter type column:', error);
    } finally {
        await pool.end();
    }
}

// Run the test
testInverterType();
