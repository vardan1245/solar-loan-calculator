-- Create panel_options table for solar panel data
CREATE TABLE IF NOT EXISTS panel_options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    wattage INTEGER NOT NULL,
    price_per_watt DECIMAL(8,4) NOT NULL,
    efficiency DECIMAL(5,2) NOT NULL,
    cell_type VARCHAR(100) NOT NULL,
    dimensions VARCHAR(200),
    weight_kg DECIMAL(5,2),
    warranty_years INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_panel_options_brand ON panel_options(brand);
CREATE INDEX IF NOT EXISTS idx_panel_options_wattage ON panel_options(wattage);
CREATE INDEX IF NOT EXISTS idx_panel_options_cell_type ON panel_options(cell_type);
CREATE INDEX IF NOT EXISTS idx_panel_options_is_active ON panel_options(is_active);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_panel_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_panel_options_updated_at 
    BEFORE UPDATE ON panel_options 
    FOR EACH ROW 
    EXECUTE FUNCTION update_panel_options_updated_at();

-- Verify table creation
\d panel_options;
