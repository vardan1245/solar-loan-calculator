-- Fix the description for 12Y warranty record
-- This updates the description from "10-year warranty period" to "12-year warranty period"

UPDATE system_cost_settings 
SET description = 'Profit per kW for 12-year warranty period'
WHERE category = 'profit_margin' AND warranty_years = 12;

-- Verify the change
SELECT 
    id,
    warranty_years,
    profit_per_kw,
    name,
    description
FROM system_cost_settings 
WHERE category = 'profit_margin' AND warranty_years = 12;

-- Also verify all profit margins are correct
SELECT 
    warranty_years,
    profit_per_kw,
    name,
    description
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;
