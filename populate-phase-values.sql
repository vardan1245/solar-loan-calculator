-- Populate phase values for existing inverters
-- Most residential inverters are 1-phase, commercial/industrial are often 3-phase

-- Update all existing inverters to 1-phase by default (most common for residential)
UPDATE inverter_options SET phase = 'one phase' WHERE phase IS NULL;

-- Update specific inverters to 3-phase if they are commercial/industrial grade
-- You can customize these based on your actual inverter specifications
-- UPDATE inverter_options SET phase = 'three phase' WHERE kw >= 20 AND brand IN ('Commercial Brand', 'Industrial Brand');

-- Verify the changes
SELECT id, name, brand, kw, type, phase FROM inverter_options ORDER BY kw LIMIT 10;

-- Show phase distribution
SELECT phase, COUNT(*) as count FROM inverter_options GROUP BY phase;
