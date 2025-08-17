-- Add LA Solar 580W panel to panel_options table
INSERT INTO panel_options (brand, model, wattage, price_per_watt, efficiency, cell_type, warranty_years, description, created_at, updated_at)
VALUES (
    'LA Solar',
    'LS580TC',
    580,
    0.85, -- 0.85 AMD per watt (estimated market price)
    22.44, -- 22.44% efficiency (actual specification)
    'Monocrystalline',
    30, -- 30 years warranty (actual specification)
    'LA Solar LS580TC 580W Monocrystalline Solar Panel - High efficiency 22.44%, 30 year warranty, commercial grade',
    NOW(),
    NOW()
);

-- Verify the insertion
SELECT * FROM panel_options WHERE brand = 'LA Solar' AND model = 'LA-580M';
