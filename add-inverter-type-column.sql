-- Migration: Add 'type' column to inverter_options table
-- This script adds a new column to categorize inverters as on-grid, off-grid, or hybrid

-- Step 1: Create the enum type for inverter types
CREATE TYPE inverter_type AS ENUM ('on_grid', 'off_grid', 'hybrid');

-- Step 2: Add the type column to the inverter_options table
ALTER TABLE inverter_options 
ADD COLUMN type inverter_type NOT NULL DEFAULT 'on_grid';

-- Step 3: Add a comment to document the new column
COMMENT ON COLUMN inverter_options.type IS 'Type of inverter: on_grid, off_grid, or hybrid';

-- Step 4: Create an index on the type column for better query performance
CREATE INDEX idx_inverter_options_type ON inverter_options(type);

-- Step 5: Update existing records to have 'on_grid' type (since you mentioned all current inverters are on-grid)
UPDATE inverter_options 
SET type = 'on_grid' 
WHERE type IS NULL OR type = 'on_grid';

-- Step 6: Verify the changes
-- You can run this query to see the updated table structure:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'inverter_options' 
-- ORDER BY ordinal_position;

-- Step 7: Show sample data with the new column
SELECT id, name, brand, model, kw, price, type, is_active 
FROM inverter_options 
ORDER BY kw 
LIMIT 5;
