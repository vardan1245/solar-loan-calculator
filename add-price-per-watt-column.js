// Script to add price_per_watt column and set up automatic calculation
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function addPricePerWattColumn() {
    try {

        // Add price_per_watt column
        await pool.query('ALTER TABLE panel_options ADD COLUMN price_per_watt DECIMAL(8,4)');

        // Calculate and populate price_per_watt for existing rows
        const updateQuery = `
            UPDATE panel_options 
            SET price_per_watt = ROUND((price::numeric / wattage::numeric), 4)
        `;
        
        const result = await pool.query(updateQuery);

        // Create a function to automatically calculate price_per_watt
        const createFunctionQuery = `
            CREATE OR REPLACE FUNCTION calculate_price_per_watt()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.price_per_watt = ROUND((NEW.price::numeric / NEW.wattage::numeric), 4);
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `;
        
        await pool.query(createFunctionQuery);

        // Create trigger to automatically update price_per_watt when price or wattage changes
        const createTriggerQuery = `
            CREATE TRIGGER trigger_calculate_price_per_watt
                BEFORE INSERT OR UPDATE ON panel_options
                FOR EACH ROW
                EXECUTE FUNCTION calculate_price_per_watt();
        `;
        
        await pool.query(createTriggerQuery);

        // Verify the data
        const verifyQuery = `
            SELECT brand, model, wattage, price, price_per_watt, 
                   ROUND((price::numeric / wattage::numeric), 4) as calculated_price_per_watt
            FROM panel_options 
            ORDER BY wattage DESC
        `;
        
        const verify = await pool.query(verifyQuery);
        
        verify.rows.forEach(panel => {
            
        });
        
        // Test the trigger by updating one panel
        const testUpdateQuery = `
            UPDATE panel_options 
            SET price = price + 100 
            WHERE brand = 'LA Solar' AND model = 'LS580TC'
        `;
        
        await pool.query(testUpdateQuery);

        // Check the result
        const testResult = await pool.query(`
            SELECT brand, model, wattage, price, price_per_watt 
            FROM panel_options 
            WHERE brand = 'LA Solar' AND model = 'LS580TC'
        `);
        
        if (testResult.rows.length > 0) {
            const panel = testResult.rows[0];
            
        }

    } catch (error) {
        console.error('❌ Error adding price_per_watt column:', error);
    } finally {
        await pool.end();
    }
}

// Run the script
addPricePerWattColumn();
