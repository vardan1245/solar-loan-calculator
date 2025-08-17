-- Sample Data for Tiamat Solar Loan Calculator with 12Y Warranty
-- This file contains sample data that matches the updated 12Y warranty system

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM system_cost_settings;

-- Insert sample data for inverters
INSERT INTO system_cost_settings (category, name, kw, price) VALUES
('inverter', '3 kW Inverter', 3.0, 202000),
('inverter', '3.6 kW Inverter', 3.6, 209000),
('inverter', '5.3 kW Inverter', 5.3, 238000),
('inverter', '6 kW Inverter', 6.0, 396000),
('inverter', '8 kW Inverter', 8.0, 418000),
('inverter', '10 kW Inverter', 10.0, 432000),
('inverter', '12 kW Inverter', 12.0, 446000),
('inverter', '15 kW Inverter', 15.0, 461000),
('inverter', '20 kW Inverter', 20.0, 533000),
('inverter', '25 kW Inverter', 25.0, 576000),
('inverter', '30 kW Inverter', 30.0, 936000),
('inverter', '40 kW Inverter', 40.0, 1037000),
('inverter', '50 kW Inverter', 50.0, 1094000),
('inverter', '60 kW Inverter', 60.0, 1181000),
('inverter', '75 kW Inverter', 75.0, 1260000),
('inverter', '100 kW Inverter', 100.0, 1649000),
('inverter', '110 kW Inverter', 110.0, 1728000)
ON CONFLICT (category, name) DO NOTHING;

-- Insert sample data for base prices
INSERT INTO system_cost_settings (category, name, installation_type, price) VALUES
('base_price', 'On Roof Installation', 'onRoof', 105000),
('base_price', 'Metal Construction on Roof', 'metalConstructionOnRoof', 115000),
('base_price', 'System on Ground', 'systemOnGround', 117000),
('base_price', 'Aluminium Construction on Roof', 'aluminiumConstructionOnRoof', 130000)
ON CONFLICT (category, name) DO NOTHING;

-- Insert sample data for profit margins (UPDATED with 12Y instead of 10Y)
INSERT INTO system_cost_settings (category, name, warranty_years, profit_per_kw) VALUES
('profit_margin', '2 Years Warranty', 2, 15000),
('profit_margin', '3 Years Warranty', 3, 20000),
('profit_margin', '6 Years Warranty', 6, 25000),
('profit_margin', '12 Years Warranty', 12, 30000)
ON CONFLICT (category, name) DO NOTHING;

-- Insert sample data for percentages
INSERT INTO system_cost_settings (category, name, value) VALUES
('percentage', 'salesTeam', 0.06),
('percentage', 'unexpectedExpenses', 0.02)
ON CONFLICT (category, name) DO NOTHING;

-- Insert sample data for bank configurations
INSERT INTO system_cost_settings (category, name, bank_name, interest_rate, commission, loan_period) VALUES
-- ArmEconomBank options
('bank', 'ArmEconomBank 0% 36m', 'ArmEconomBank', 0.00, 0.21, 36),
('bank', 'ArmEconomBank 0% 60m', 'ArmEconomBank', 0.00, 0.32, 60),
('bank', 'ArmEconomBank 0% 84m', 'ArmEconomBank', 0.00, 0.41, 84),
('bank', 'ArmEconomBank 3% 36m', 'ArmEconomBank', 0.03, 0.18, 36),
('bank', 'ArmEconomBank 3% 60m', 'ArmEconomBank', 0.03, 0.27, 60),
('bank', 'ArmEconomBank 3% 84m', 'ArmEconomBank', 0.03, 0.34, 84),
('bank', 'ArmEconomBank 5% 36m', 'ArmEconomBank', 0.05, 0.16, 36),
('bank', 'ArmEconomBank 5% 60m', 'ArmEconomBank', 0.05, 0.23, 60),
('bank', 'ArmEconomBank 5% 84m', 'ArmEconomBank', 0.05, 0.30, 84),
('bank', 'ArmEconomBank 9% 36m', 'ArmEconomBank', 0.09, 0.10, 36),
('bank', 'ArmEconomBank 9% 60m', 'ArmEconomBank', 0.09, 0.15, 60),
('bank', 'ArmEconomBank 9% 84m', 'ArmEconomBank', 0.09, 0.19, 84),
('bank', 'ArmEconomBank 12% 36m', 'ArmEconomBank', 0.12, 0.06, 36),
('bank', 'ArmEconomBank 12% 60m', 'ArmEconomBank', 0.12, 0.09, 60),
('bank', 'ArmEconomBank 12% 84m', 'ArmEconomBank', 0.12, 0.11, 84),
('bank', 'ArmEconomBank 15% 36m', 'ArmEconomBank', 0.15, 0.02, 36),
('bank', 'ArmEconomBank 15% 60m', 'ArmEconomBank', 0.15, 0.03, 60),
('bank', 'ArmEconomBank 15% 84m', 'ArmEconomBank', 0.15, 0.04, 84),
-- ACBA Bank options
('bank', 'ACBA Bank 11% 96m', 'ACBA Bank', 0.11, 0.04, 96)
ON CONFLICT (category, name) DO NOTHING;

-- Verify the data was inserted correctly
SELECT 
    'Profit Margins' as info,
    warranty_years || ' Years' as warranty,
    profit_per_kw || ' AMD/kW' as profit
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;

-- Display all categories for verification
SELECT 
    category,
    COUNT(*) as count
FROM system_cost_settings 
GROUP BY category 
ORDER BY category;
