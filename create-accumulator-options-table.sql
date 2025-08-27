-- Migration: Create accumulator_options table for battery storage options
-- This script creates a new table to store battery/accumulator options for hybrid systems

-- Step 1: Create the accumulator_options table
CREATE TABLE IF NOT EXISTS accumulator_options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    capacity_kwh DECIMAL(6,2) NOT NULL, -- Battery capacity in kWh
    voltage DECIMAL(5,2) NOT NULL, -- Battery voltage (typically 48V, 24V, etc.)
    price INTEGER NOT NULL, -- Price in Armenian Dram (AMD)
    cycle_life INTEGER, -- Number of charge/discharge cycles
    warranty_years INTEGER DEFAULT 5, -- Warranty period in years
    chemistry VARCHAR(50), -- Battery chemistry (LiFePO4, NMC, etc.)
    dimensions VARCHAR(100), -- Physical dimensions
    weight_kg DECIMAL(5,2), -- Weight in kilograms
    description TEXT, -- Additional description
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Add comments to document the table structure
COMMENT ON TABLE accumulator_options IS 'Battery storage options for hybrid solar systems';
COMMENT ON COLUMN accumulator_options.capacity_kwh IS 'Battery capacity in kilowatt-hours';
COMMENT ON COLUMN accumulator_options.voltage IS 'Battery voltage in volts';
COMMENT ON COLUMN accumulator_options.cycle_life IS 'Expected number of charge/discharge cycles';
COMMENT ON COLUMN accumulator_options.chemistry IS 'Battery chemistry type (LiFePO4, NMC, etc.)';

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accumulator_options_capacity ON accumulator_options(capacity_kwh);
CREATE INDEX IF NOT EXISTS idx_accumulator_options_voltage ON accumulator_options(voltage);
CREATE INDEX IF NOT EXISTS idx_accumulator_options_brand ON accumulator_options(brand);
CREATE INDEX IF NOT EXISTS idx_accumulator_options_active ON accumulator_options(is_active);

-- Step 4: Insert sample data for common battery options
INSERT INTO accumulator_options (name, brand, model, capacity_kwh, voltage, price, cycle_life, warranty_years, chemistry, dimensions, weight_kg, description) VALUES
-- LiFePO4 Batteries (Most common for solar)
('Pylontech US2000B', 'Pylontech', 'US2000B', 2.4, 48.0, 450000, 6000, 10, 'LiFePO4', '442x420x133mm', 25.0, 'High-quality LiFePO4 battery with long cycle life'),
('Pylontech US3000C', 'Pylontech', 'US3000C', 3.5, 48.0, 650000, 6000, 10, 'LiFePO4', '442x420x133mm', 35.0, '3.5kWh battery with excellent performance'),
('Growatt ARK 2.5H', 'Growatt', 'ARK 2.5H', 2.5, 48.0, 480000, 5000, 10, 'LiFePO4', '400x400x150mm', 28.0, 'Growatt battery with good price-performance ratio'),
('Growatt ARK 5.0H', 'Growatt', 'ARK 5.0H', 5.0, 48.0, 850000, 5000, 10, 'LiFePO4', '400x400x200mm', 45.0, '5kWh battery for larger systems'),
('Victron Energy Smart 12.8/200', 'Victron', 'Smart 12.8/200', 2.56, 12.8, 180000, 4000, 8, 'LiFePO4', '200x170x170mm', 8.0, 'Small battery for off-grid applications'),
('Victron Energy Smart 25.6/200', 'Victron', 'Smart 25.6/200', 5.12, 25.6, 320000, 4000, 8, 'LiFePO4', '200x170x170mm', 15.0, 'Medium battery for residential systems'),
('BYD Battery-Box Premium HVS', 'BYD', 'Premium HVS', 7.0, 48.0, 1200000, 6000, 10, 'LiFePO4', '600x600x250mm', 55.0, 'Premium BYD battery with high capacity'),
('BYD Battery-Box Premium HVM', 'BYD', 'Premium HVM', 10.0, 48.0, 1650000, 6000, 10, 'LiFePO4', '600x600x350mm', 75.0, 'Large capacity BYD battery for commercial use');

-- Step 5: Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_accumulator_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accumulator_options_updated_at 
    BEFORE UPDATE ON accumulator_options 
    FOR EACH ROW 
    EXECUTE FUNCTION update_accumulator_options_updated_at();

-- Step 6: Verify the table creation
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'accumulator_options' 
ORDER BY ordinal_position;

-- Step 7: Show sample data
SELECT id, name, brand, model, capacity_kwh, voltage, price, chemistry, warranty_years 
FROM accumulator_options 
ORDER BY capacity_kwh 
LIMIT 5;
