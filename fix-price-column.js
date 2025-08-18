// Script to fix the price column and update LA Solar panel price
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function fixPriceColumn() {
    try {
        console.log('🔧 Fixing price column to handle larger values...');
        
        // Alter the price column to handle larger values
        // Change from DECIMAL(8,4) to DECIMAL(10,2) to handle prices up to 99999999.99
        await pool.query('ALTER TABLE panel_options ALTER COLUMN price TYPE DECIMAL(10,2)');
        console.log('✅ Price column updated to DECIMAL(10,2)');
        
        // Update LA Solar panel price to 39000 AMD
        const updateQuery = `
            UPDATE panel_options 
            SET price = 39000, 
                updated_at = NOW() 
            WHERE brand = 'LA Solar' AND model = 'LS580TC'
        `;
        
        const result = await pool.query(updateQuery);
        console.log(`✅ Updated LA Solar LS580TC price: ${result.rowCount} row(s) affected`);
        
        // Verify the update
        const verifyQuery = `
            SELECT brand, model, wattage, price, 
                   ROUND(price / wattage, 4) as price_per_watt_amd
            FROM panel_options 
            WHERE brand = 'LA Solar' AND model = 'LS580TC'
        `;
        
        const verify = await pool.query(verifyQuery);
        if (verify.rows.length > 0) {
            const panel = verify.rows[0];
            console.log(`\n📊 LA Solar LS580TC updated:`);
            console.log(`   Brand: ${panel.brand}`);
            console.log(`   Model: ${panel.model}`);
            console.log(`   Wattage: ${panel.wattage}W`);
            console.log(`   Total Price: ${panel.price} AMD`);
            console.log(`   Price per Watt: ${panel.price_per_watt_amd} AMD/W`);
        }
        
        // Show all panel prices
        const allPanelsQuery = `
            SELECT brand, model, wattage, price, 
                   ROUND(price / wattage, 4) as price_per_watt_amd
            FROM panel_options 
            ORDER BY wattage DESC
        `;
        
        const allPanels = await pool.query(allPanelsQuery);
        console.log('\n📋 All panel prices:');
        allPanels.rows.forEach(panel => {
            console.log(`   ${panel.brand} ${panel.model}: ${panel.wattage}W, ${panel.price} AMD (${panel.price_per_watt_amd} AMD/W)`);
        });
        
        console.log('\n✅ Price column fixed and LA Solar panel updated successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing price column:', error);
    } finally {
        await pool.end();
    }
}

// Run the script
fixPriceColumn();
