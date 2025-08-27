-- Migration: Rename accumulator_options table to battery_options
-- This migration renames the table and updates all related objects

-- Step 1: Rename the table
ALTER TABLE IF EXISTS accumulator_options RENAME TO battery_options;

-- Step 2: Rename the indexes (remove IF EXISTS as it's not supported in all PostgreSQL versions)
DO $$
BEGIN
    -- Rename indexes if they exist
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accumulator_options_capacity') THEN
        ALTER INDEX idx_accumulator_options_capacity RENAME TO idx_battery_options_capacity;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accumulator_options_voltage') THEN
        ALTER INDEX idx_accumulator_options_voltage RENAME TO idx_battery_options_voltage;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accumulator_options_brand') THEN
        ALTER INDEX idx_accumulator_options_brand RENAME TO idx_battery_options_brand;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accumulator_options_active') THEN
        ALTER INDEX idx_accumulator_options_active RENAME TO idx_battery_options_active;
    END IF;
END $$;

-- Step 3: Drop and recreate the trigger with new function name
DROP TRIGGER IF EXISTS update_accumulator_options_updated_at ON battery_options;
DROP FUNCTION IF EXISTS update_accumulator_options_updated_at();

-- Step 4: Create new function
CREATE OR REPLACE FUNCTION update_battery_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create new trigger
CREATE TRIGGER update_battery_options_updated_at
    BEFORE UPDATE ON battery_options
    FOR EACH ROW
    EXECUTE FUNCTION update_battery_options_updated_at();

-- Step 6: Update table comments
COMMENT ON TABLE battery_options IS 'Battery storage options for hybrid solar systems';

-- Step 7: Verify the changes
SELECT 
    t.table_name,
    i.indexname as index_name,
    tr.trigger_name
FROM information_schema.tables t
LEFT JOIN pg_indexes i ON t.table_name = i.tablename
LEFT JOIN information_schema.triggers tr ON t.table_name = tr.event_object_table
WHERE t.table_name = 'battery_options';

-- Step 8: Show sample data to confirm migration
SELECT 
    id,
    name,
    brand,
    model,
    capacity_kwh,
    voltage,
    price,
    cycle_life,
    warranty_years,
    chemistry
FROM battery_options 
LIMIT 5;
