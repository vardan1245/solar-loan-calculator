-- Add phase column to inverter_options table
-- This migration adds a phase column to distinguish between 1-phase and 3-phase inverters

-- First, create the enum type for phases
CREATE TYPE inverter_phase AS ENUM ('one phase', 'three phase');

-- Add the phase column to the inverter_options table
ALTER TABLE inverter_options ADD COLUMN phase inverter_phase DEFAULT 'one phase';

-- Update existing inverters to have appropriate phase values
-- Most residential inverters are 1-phase, commercial/industrial are often 3-phase
-- You can manually update specific inverters as needed

-- Example: Update specific inverters to 3-phase if needed
-- UPDATE inverter_options SET phase = '3_phase' WHERE brand = 'Commercial Brand' AND kw >= 10;

-- Add a comment to the column
COMMENT ON COLUMN inverter_options.phase IS 'Phase configuration: one phase or three phase';

-- Verify the changes
SELECT id, name, brand, kw, type, phase FROM inverter_options LIMIT 5;
