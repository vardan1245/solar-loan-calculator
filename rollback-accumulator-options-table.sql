-- Rollback: Remove accumulator_options table
-- This script undoes the changes made by create-accumulator-options-table.sql

-- Step 1: Drop the trigger first
DROP TRIGGER IF EXISTS update_accumulator_options_updated_at ON accumulator_options;

-- Step 2: Drop the function
DROP FUNCTION IF EXISTS update_accumulator_options_updated_at();

-- Step 3: Drop all indexes
DROP INDEX IF EXISTS idx_accumulator_options_capacity;
DROP INDEX IF EXISTS idx_accumulator_options_voltage;
DROP INDEX IF EXISTS idx_accumulator_options_brand;
DROP INDEX IF EXISTS idx_accumulator_options_active;

-- Step 4: Drop the table
DROP TABLE IF EXISTS accumulator_options;

-- Step 5: Verify the rollback
-- You can run this query to confirm the table is gone:
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'accumulator_options';

-- Step 6: Show remaining tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
