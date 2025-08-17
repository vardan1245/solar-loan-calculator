# Database Setup for 12-Year Warranty System

This document explains how to set up your database to work with the updated 12-year warranty system.

## Overview

The system has been updated from 10-year warranty to 12-year warranty. This affects:
- Frontend dropdown options
- Database profit margin calculations
- Default warranty period

## Files Created

1. **`database-migration-12Y.sql`** - Migration script for existing databases
2. **`sample-data-12Y.sql`** - Sample data for fresh database setup
3. **`database-schema.sql`** - Updated schema (already contains 12Y data)

## Database Setup Options

### Option 1: Fresh Database Setup

If you're setting up a new database:

1. Create your database:
   ```sql
   CREATE DATABASE tiamat_loan_calculator;
   ```

2. Run the schema:
   ```bash
   psql -d tiamat_loan_calculator -f database-schema.sql
   ```

3. Populate with sample data:
   ```bash
   psql -d tiamat_loan_calculator -f sample-data-12Y.sql
   ```

### Option 2: Migrate Existing Database

If you have an existing database with 10Y warranty data:

1. Run the migration script:
   ```bash
   psql -d your_database_name -f database-migration-12Y.sql
   ```

2. Verify the data:
   ```sql
   SELECT * FROM system_cost_settings WHERE category = 'profit_margin';
   ```

## Required Database Structure

The system expects these profit margin entries:

| Warranty Years | Database Key | Profit per kW |
|----------------|---------------|---------------|
| 2              | profit_per_kw_2Y | 15,000 AMD |
| 3              | profit_per_kw_3Y | 20,000 AMD |
| 6              | profit_per_kw_6Y | 25,000 AMD |
| 12             | profit_per_kw_12Y | 30,000 AMD |

## Verification

After setup, verify your database has the correct data:

```sql
-- Check profit margins
SELECT 
    warranty_years,
    profit_per_kw,
    name
FROM system_cost_settings 
WHERE category = 'profit_margin' 
ORDER BY warranty_years;

-- Check all categories
SELECT 
    category,
    COUNT(*) as count
FROM system_cost_settings 
GROUP BY category;
```

## Troubleshooting

### Error: "Profit value not found for 12-year warranty"

This error occurs when the database doesn't have the `profit_per_kw_12Y` data. Solutions:

1. **Run the migration script** if you have an existing database
2. **Check database connection** - ensure your server can connect to the database
3. **Verify data exists** - run the verification queries above
4. **Check table structure** - ensure the `system_cost_settings` table exists

### Database Connection Issues

1. Check your database connection settings in `config.js`
2. Ensure PostgreSQL is running
3. Verify database credentials and permissions

## API Endpoints

The system expects these API endpoints to return data:

- `/api/system-cost-settings` - Base prices and percentages
- `/api/inverters` - Inverter list with prices
- `/api/profits` - Profit margins for different warranty periods
- `/api/banks` - Bank loan configurations

## Frontend Changes

The frontend has been updated to:
- Show "12 Years" in the warranty dropdown
- Default to 12 years instead of 10 years
- Look for `profit_per_kw_12Y` in the database
- Display appropriate error messages for missing data

## Support

If you encounter issues:
1. Check the database logs
2. Verify all required data exists
3. Ensure the frontend can connect to the backend
4. Check that all API endpoints return the expected data structure
