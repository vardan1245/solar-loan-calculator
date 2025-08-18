// Script to populate panel_options table with solar panel data
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

const panelData = [
    // LA Solar 580W panel (as requested)
    {
        brand: 'LA Solar',
        model: 'LS580TC',
        wattage: 580,
        price_per_watt: 0.85,
        efficiency: 22.44,
        cell_type: 'Monocrystalline',
        warranty_years: 30,
        description: 'LA Solar LS580TC 580W Monocrystalline Solar Panel - High efficiency 22.44%, 30 year warranty'
    },
    // Additional panels for variety
    {
        brand: 'Jinko Solar',
        model: 'JKM-500M-72HL4',
        wattage: 500,
        price_per_watt: 0.88,
        efficiency: 20.4,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Jinko Solar 500W High Power Panel'
    },
    {
        brand: 'Longi',
        model: 'LR4-72HPH-500M',
        wattage: 500,
        price_per_watt: 0.87,
        efficiency: 20.7,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Longi 500W High Efficiency Panel'
    },
    {
        brand: 'Canadian Solar',
        model: 'CS6R-500MS',
        wattage: 500,
        price_per_watt: 0.89,
        efficiency: 20.2,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Canadian Solar 500W Commercial Panel'
    },
    {
        brand: 'Jinko Solar',
        model: 'JKM-450M-72HL4',
        wattage: 450,
        price_per_watt: 0.82,
        efficiency: 20.1,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Jinko Solar 450W Standard Panel'
    },
    {
        brand: 'Longi',
        model: 'LR4-72HPH-450M',
        wattage: 450,
        price_per_watt: 0.81,
        efficiency: 20.4,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Longi 450W High Efficiency Panel'
    },
    {
        brand: 'Jinko Solar',
        model: 'JKM-400M-72HL4',
        wattage: 400,
        price_per_watt: 0.78,
        efficiency: 19.8,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Jinko Solar 400W Residential Panel'
    },
    {
        brand: 'Longi',
        model: 'LR4-72HPH-400M',
        wattage: 400,
        price_per_watt: 0.77,
        efficiency: 20.1,
        cell_type: 'Monocrystalline PERC',
        warranty_years: 25,
        description: 'Longi 400W High Efficiency Panel'
    }
];

async function populatePanels() {
    try {

        // Clear existing data (optional)
        await pool.query('DELETE FROM panel_options');

        // Insert new panel data
        for (const panel of panelData) {
            const query = `
                INSERT INTO panel_options (brand, model, wattage, price_per_watt, efficiency, cell_type, warranty_years, description, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            `;
            
            const values = [
                panel.brand,
                panel.model,
                panel.wattage,
                panel.price_per_watt,
                panel.efficiency,
                panel.cell_type,
                panel.warranty_years,
                panel.description
            ];
            
            await pool.query(query, values);
            
        }
        
        // Verify the data
        const result = await pool.query('SELECT COUNT(*) as total FROM panel_options');

        // Show sample data
        const sampleData = await pool.query('SELECT brand, model, wattage, price_per_watt, efficiency FROM panel_options ORDER BY wattage DESC LIMIT 5');
        
        sampleData.rows.forEach(row => {
            
        });

    } catch (error) {
        console.error('❌ Error populating panels:', error);
    } finally {
        await pool.end();
    }
}

// Run the script
populatePanels();
