-- Add LA Solar LS580TC 580W panel to panel_options table
-- Specifications provided by user:
-- Brand: LA Solar
-- Model: LS580TC
-- Wattage: 580W
-- Cell Type: Monocrystalline
-- Efficiency: 22.44%
-- Dimensions: ~2279 × 1134 × 35 mm
-- Weight: ~26 kg
-- Warranty: 30 years

INSERT INTO panel_options (brand, model, wattage, price_per_watt, efficiency, cell_type, warranty_years, description, created_at, updated_at)
VALUES (
    'LA Solar',
    'LS580TC',
    580,
    0.85, -- 0.85 AMD per watt (estimated market price - adjust as needed)
    22.44, -- 22.44% efficiency (actual specification)
    'Monocrystalline',
    30, -- 30 years warranty (actual specification)
    'LA Solar LS580TC 580W Monocrystalline Solar Panel - High efficiency 22.44%, 30 year warranty, commercial grade',
    NOW(),
    NOW()
);

-- Verify the insertion
SELECT 
    brand, 
    model, 
    wattage, 
    price_per_watt, 
    efficiency, 
    cell_type, 
    warranty_years,
    ROUND(wattage * price_per_watt, 0) as total_price_amd,
    description
FROM panel_options 
WHERE brand = 'LA Solar' AND model = 'LS580TC';
