-- Comprehensive Panel Database for Solar Calculator
-- This script adds multiple panel options with realistic specifications and pricing

-- Clear existing panel data (optional - uncomment if you want to start fresh)
-- DELETE FROM panel_options;

-- Add LA Solar 580W panel
INSERT INTO panel_options (brand, model, wattage, price_per_watt, efficiency, cell_type, warranty_years, description, created_at, updated_at)
VALUES (
    'LA Solar',
    'LS580TC',
    580,
    0.85, -- 0.85 AMD per watt
    22.44, -- 22.44% efficiency (actual specification)
    'Monocrystalline',
    30, -- 30 years warranty (actual specification)
    'LA Solar LS580TC 580W Monocrystalline Solar Panel - High efficiency 22.44%, 30 year warranty',
    NOW(),
    NOW()
);

-- Add additional panel options for variety
INSERT INTO panel_options (brand, model, wattage, price_per_watt, efficiency, cell_type, warranty_years, description, created_at, updated_at)
VALUES 
-- High Power Panels (500W+)
('Jinko Solar', 'JKM-500M-72HL4', 500, 0.88, 20.4, 'Monocrystalline PERC', 25, 'Jinko Solar 500W High Power Panel', NOW(), NOW()),
('Longi', 'LR4-72HPH-500M', 500, 0.87, 20.7, 'Monocrystalline PERC', 25, 'Longi 500W High Efficiency Panel', NOW(), NOW()),
('Canadian Solar', 'CS6R-500MS', 500, 0.89, 20.2, 'Monocrystalline PERC', 25, 'Canadian Solar 500W Commercial Panel', NOW(), NOW()),

-- Standard Power Panels (400-499W)
('Jinko Solar', 'JKM-450M-72HL4', 450, 0.82, 20.1, 'Monocrystalline PERC', 25, 'Jinko Solar 450W Standard Panel', NOW(), NOW()),
('Longi', 'LR4-72HPH-450M', 450, 0.81, 20.4, 'Monocrystalline PERC', 25, 'Longi 450W High Efficiency Panel', NOW(), NOW()),
('Trina Solar', 'TSM-450DE15', 450, 0.83, 20.3, 'Monocrystalline PERC', 25, 'Trina Solar 450W Dual Glass Panel', NOW(), NOW()),

-- Residential Panels (300-399W)
('Jinko Solar', 'JKM-400M-72HL4', 400, 0.78, 19.8, 'Monocrystalline PERC', 25, 'Jinko Solar 400W Residential Panel', NOW(), NOW()),
('Longi', 'LR4-72HPH-400M', 400, 0.77, 20.1, 'Monocrystalline PERC', 25, 'Longi 400W High Efficiency Panel', NOW(), NOW()),
('Canadian Solar', 'CS6R-400MS', 400, 0.79, 19.9, 'Monocrystalline PERC', 25, 'Canadian Solar 400W Standard Panel', NOW(), NOW()),

-- Budget Options (250-299W)
('Jinko Solar', 'JKM-300M-60HL4', 300, 0.72, 18.9, 'Polycrystalline', 25, 'Jinko Solar 300W Budget Panel', NOW(), NOW()),
('Longi', 'LR6-60HPH-300M', 300, 0.71, 19.1, 'Polycrystalline', 25, 'Longi 300W Standard Panel', NOW(), NOW());

-- Verify all insertions
SELECT 
    brand, 
    model, 
    wattage, 
    price_per_watt, 
    efficiency, 
    cell_type, 
    warranty_years,
    ROUND(wattage * price_per_watt, 0) as total_price_amd
FROM panel_options 
ORDER BY wattage DESC, brand, model;
