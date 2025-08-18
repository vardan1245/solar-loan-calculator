// Script to repopulate all panels with realistic prices
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: 'postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

const panelData = [
    // LA Solar LS580TC panel (as requested by user)
    {
        name: 'LA Solar LS580TC',
        brand: 'LA Solar',
        model: 'LS580TC',
        wattage: 580,
        price: 39000, // 39000 AMD as requested
        efficiency: 22.44,
        cell_type: 'Monocrystalline',
        dimensions: '2279 × 1134 × 35 mm',
        weight_kg: 26,
        warranty_years: 30,
        description: 'LA Solar LS580TC 580W Monocrystalline Solar Panel - High efficiency 22.44%, 30 year warranty, commercial grade'
    },
    // Additional panels with realistic prices
    {
        name: 'Jinko Solar JKM-500M-72HL4',
        brand: 'Jinko Solar',
        model: 'JKM-500M-72HL4',
        wattage: 500,
        price: 35000, // 70 AMD/W
        efficiency: 20.4,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 24.5,
        warranty_years: 25,
        description: 'Jinko Solar 500W High Power Panel'
    },
    {
        name: 'Longi LR4-72HPH-500M',
        brand: 'Longi',
        model: 'LR4-72HPH-500M',
        wattage: 500,
        price: 36000, // 72 AMD/W
        efficiency: 20.7,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 24.8,
        warranty_years: 25,
        description: 'Longi 500W High Efficiency Panel'
    },
    {
        name: 'Canadian Solar CS6R-500MS',
        brand: 'Canadian Solar',
        model: 'CS6R-500MS',
        wattage: 500,
        price: 37000, // 74 AMD/W
        efficiency: 20.2,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 25.2,
        warranty_years: 25,
        description: 'Canadian Solar 500W Commercial Panel'
    },
    {
        name: 'Jinko Solar JKM-450M-72HL4',
        brand: 'Jinko Solar',
        model: 'JKM-450M-72HL4',
        wattage: 450,
        price: 31000, // ~69 AMD/W
        efficiency: 20.1,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 23.8,
        warranty_years: 25,
        description: 'Jinko Solar 450W Standard Panel'
    },
    {
        name: 'Longi LR4-72HPH-450M',
        brand: 'Longi',
        model: 'LR4-72HPH-450M',
        wattage: 450,
        price: 32000, // ~71 AMD/W
        efficiency: 20.4,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 24.1,
        warranty_years: 25,
        description: 'Longi 450W High Efficiency Panel'
    },
    {
        name: 'Jinko Solar JKM-400M-72HL4',
        brand: 'Jinko Solar',
        model: 'JKM-400M-72HL4',
        wattage: 400,
        price: 28000, // 70 AMD/W
        efficiency: 19.8,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 23.2,
        warranty_years: 25,
        description: 'Jinko Solar 400W Residential Panel'
    },
    {
        name: 'Longi LR4-72HPH-400M',
        brand: 'Longi',
        model: 'LR4-72HPH-400M',
        wattage: 400,
        price: 29000, // ~72.5 AMD/W
        efficiency: 20.1,
        cell_type: 'Monocrystalline PERC',
        dimensions: '2184 × 1102 × 30 mm',
        weight_kg: 23.5,
        warranty_years: 25,
        description: 'Longi 400W High Efficiency Panel'
    }
];

async function repopulatePanels() {
    try {

        // Clear existing data
        await pool.query('DELETE FROM panel_options');

        // Insert new panel data
        for (const panel of panelData) {
            const query = `
                INSERT INTO panel_options (name, brand, model, wattage, price, efficiency, cell_type, dimensions, weight_kg, warranty_years, description, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
            `;
            
            const values = [
                panel.name,
                panel.brand,
                panel.model,
                panel.wattage,
                panel.price,
                panel.efficiency,
                panel.cell_type,
                panel.dimensions,
                panel.weight_kg,
                panel.warranty_years,
                panel.description
            ];
            
            await pool.query(query, values);
            
        }
        
        // Verify the data
        const result = await pool.query('SELECT COUNT(*) as total FROM panel_options');

        // Show all panel data with prices
        const allPanelsQuery = `
            SELECT brand, model, wattage, price, 
                   ROUND(price / wattage, 2) as price_per_watt_amd,
                   efficiency, warranty_years
            FROM panel_options 
            ORDER BY wattage DESC
        `;
        
        const allPanels = await pool.query(allPanelsQuery);
        
        allPanels.rows.forEach(panel => {
            
        });

    } catch (error) {
        console.error('❌ Error repopulating panels:', error);
    } finally {
        await pool.end();
    }
}

// Run the script
repopulatePanels();
