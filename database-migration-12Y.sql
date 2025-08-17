-- Database Migration Script: Update from 10Y to 12Y Warranty
-- Run this script to update your existing database

-- First, let's check if the 12Y profit margin already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM system_cost_settings 
        WHERE category = 'profit_margin' AND warranty_years = 12
    ) THEN
        -- Insert 12Y profit margin if it doesn't exist
        INSERT INTO system_cost_settings (category, name, warranty_years, profit_per_kw) 
        VALUES ('profit_margin', '12 Years Warranty', 12, 30000);
        
        RAISE NOTICE 'Inserted 12Y profit margin';
    ELSE
        RAISE NOTICE '12Y profit margin already exists';
    END IF;
END $$;

-- Update any existing 10Y entries to 12Y (if you want to migrate existing data)
-- Uncomment the following lines if you want to migrate existing 10Y data to 12Y
/*
UPDATE system_cost_settings 
SET warranty_years = 12, 
    name = '12 Years Warranty',
    profit_per_kw = 30000
WHERE category = 'profit_margin' AND warranty_years = 10;
*/

-- Verify the data
SELECT 
    category,
    name,
    warranty_years,
    profit_per_kw
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;

-- Display all profit margins for verification
SELECT 
    'Profit Margins' as info,
    warranty_years || ' Years' as warranty,
    profit_per_kw || ' AMD/kW' as profit
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;
