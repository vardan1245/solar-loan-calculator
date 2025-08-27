-- Rollback: Remove 'type' column from inverter_options table
-- This script undoes the changes made by add-inverter-type-column.sql

-- Step 1: Drop the index on the type column
DROP INDEX IF EXISTS idx_inverter_options_type;

-- Step 2: Remove the type column from the inverter_options table
ALTER TABLE inverter_options 
DROP COLUMN IF EXISTS type;

-- Step 3: Drop the enum type
DROP TYPE IF EXISTS inverter_type;

-- Step 4: Verify the rollback
-- You can run this query to see the table structure after rollback:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'inverter_options' 
-- ORDER BY ordinal_position;

-- Step 5: Show sample data to confirm the rollback
SELECT id, name, brand, model, kw, price, is_active 
FROM inverter_options 
ORDER BY kw 
LIMIT 5;
