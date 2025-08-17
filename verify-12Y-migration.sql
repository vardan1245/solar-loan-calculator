-- Verification Script for 12Y Warranty Migration
-- Run this script to verify your database changes

-- 1. Check if the table exists and has the right structure
SELECT 
    'Table Check' as check_type,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'system_cost_settings'
    ) as table_exists;

-- 2. Check all profit margins to see the current state
SELECT 
    'Profit Margins' as check_type,
    warranty_years,
    profit_per_kw,
    name,
    category
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;

-- 3. Check specifically for 12Y warranty data
SELECT 
    '12Y Warranty Check' as check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ 12Y warranty data found'
        ELSE '❌ 12Y warranty data missing'
    END as status,
    COUNT(*) as record_count
FROM system_cost_settings 
WHERE category = 'profit_margin' AND warranty_years = 12;

-- 4. Check if there are any remaining 10Y references
SELECT 
    '10Y Cleanup Check' as check_type,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ No 10Y warranty data found (good!)'
        ELSE '⚠️  Found ' || COUNT(*) || ' 10Y warranty records'
    END as status
FROM system_cost_settings 
WHERE category = 'profit_margin' AND warranty_years = 10;

-- 5. Check the total count of profit margin records
SELECT 
    'Total Profit Margins' as check_type,
    COUNT(*) as total_records,
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ Expected 4 records found'
        ELSE '⚠️  Expected 4, found ' || COUNT(*)
    END as status
FROM system_cost_settings 
WHERE category = 'profit_margin';

-- 6. Display all categories for completeness check
SELECT 
    'All Categories' as check_type,
    category,
    COUNT(*) as record_count
FROM system_cost_settings 
GROUP BY category 
ORDER BY category;

-- 7. Summary of what should be present
SELECT 
    'Expected Data Summary' as check_type,
    'Profit Margins: 2Y, 3Y, 6Y, 12Y' as expected_profit_margins,
    '12Y should have profit_per_kw = 30000' as expected_12Y_value,
    'No 10Y records should exist' as expected_cleanup;
