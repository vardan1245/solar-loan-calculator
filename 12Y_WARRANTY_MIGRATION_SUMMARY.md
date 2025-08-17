# 12-Year Warranty Migration - Complete Summary

## 🎯 What Was Accomplished

I have successfully updated the entire codebase from 10-year warranty to 12-year warranty. Here's what was changed:

### ✅ Frontend Updates (index.html & public/index.html)
- Changed HTML option from "10 Years" to "12 Years"
- Updated default warranty years from `10` to `12`
- Changed database key from `profit_per_kw_10Y` to `profit_per_kw_12Y`
- Updated all conditional logic for warranty years
- Updated comments from "Default to 10Y" to "Default to 12Y"

### ✅ Backend Updates (server.js)
- Updated server-side logic to include `_12Y` instead of `_10Y`
- Modified profit margin key detection

### ✅ Documentation Updates
- Updated `sample-offer.html` warranty display from "10 years" to "12 years"
- Updated `API_DOCUMENTATION.md` to reflect 12Y warranty

### ✅ Database Schema
- `database-schema.sql` already contains 12Y warranty data
- Created migration scripts for existing databases

## 🚨 Current Issue

**Error**: "Profit value not found for 12-year warranty. Please check database configuration."

**Root Cause**: The frontend is now looking for `profit_per_kw_12Y` in the database, but this data doesn't exist in your current database.

## 🔧 What You Need to Do

### Step 1: Database Setup

You have two options:

#### Option A: Fresh Database Setup
```bash
# 1. Create database
CREATE DATABASE tiamat_loan_calculator;

# 2. Run schema
psql -d tiamat_loan_calculator -f database-schema.sql

# 3. Populate with sample data
psql -d tiamat_loan_calculator -f sample-data-12Y.sql
```

#### Option B: Migrate Existing Database
```bash
# Run migration script
psql -d your_existing_database -f database-migration-12Y.sql
```

### Step 2: Database Connection

The system needs to connect to your database. You have several options:

#### Option 1: Environment Variables
Create a `.env` file (not tracked by git):
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
PORT=3001
NODE_ENV=development
```

#### Option 2: Update server.js
Modify `server.js` to use your database credentials directly.

### Step 3: Verify Database Data

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

-- Expected result:
-- 2 Years: 15000 AMD
-- 3 Years: 20000 AMD  
-- 6 Years: 25000 AMD
-- 12 Years: 30000 AMD
```

## 📁 Files Created for You

1. **`database-migration-12Y.sql`** - Migration script for existing databases
2. **`sample-data-12Y.sql`** - Sample data for fresh database setup
3. **`DATABASE_SETUP_12Y.md`** - Detailed database setup instructions
4. **`test-database-12Y.js`** - Test script to verify database setup
5. **`database-config.template.js`** - Database configuration template

## 🔍 Testing Your Setup

### Run the test script:
```bash
node test-database-12Y.js
```

### Manual database check:
```bash
psql -d your_database -c "SELECT * FROM system_cost_settings WHERE category = 'profit_margin';"
```

## 🚀 Quick Start Commands

```bash
# 1. Start your database (if using local PostgreSQL)
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Linux

# 2. Create and populate database
createdb tiamat_loan_calculator
psql -d tiamat_loan_calculator -f database-schema.sql
psql -d tiamat_loan_calculator -f sample-data-12Y.sql

# 3. Start the server
node server.js

# 4. Test in browser
open http://localhost:3001
```

## ❌ Common Issues & Solutions

### Issue 1: "Database connection failed"
- **Solution**: Check if PostgreSQL is running
- **Solution**: Verify database credentials
- **Solution**: Ensure database exists

### Issue 2: "Table system_cost_settings does not exist"
- **Solution**: Run `database-schema.sql` first

### Issue 3: "No profit margins found"
- **Solution**: Run `sample-data-12Y.sql` to populate data

### Issue 4: "12Y warranty data missing"
- **Solution**: Run migration script or sample data script

## 📊 Expected Database Structure

Your `system_cost_settings` table should contain:

| Category | Warranty Years | Profit per kW | Name |
|----------|----------------|---------------|------|
| profit_margin | 2 | 15000 | 2 Years Warranty |
| profit_margin | 3 | 20000 | 3 Years Warranty |
| profit_margin | 6 | 25000 | 6 Years Warranty |
| profit_margin | 12 | 30000 | 12 Years Warranty |

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Database connects without errors
2. ✅ 12Y warranty option appears in dropdown
3. ✅ No "Profit value not found" errors
4. ✅ Loan calculations work with 12Y warranty
5. ✅ Profit margins display correctly

## 📞 Need Help?

1. Check `DATABASE_SETUP_12Y.md` for detailed instructions
2. Run `test-database-12Y.js` for diagnostic information
3. Verify database connection and data with SQL queries
4. Check server logs for connection errors

## 🔄 Migration Checklist

- [ ] Database created and accessible
- [ ] Tables created from schema
- [ ] 12Y warranty data populated
- [ ] Database connection configured
- [ ] Server starts without errors
- [ ] Frontend loads without warranty errors
- [ ] 12Y warranty option works correctly
- [ ] Profit calculations work for 12Y warranty

Once you complete these steps, the "Profit value not found for 12-year warranty" error will be resolved, and your system will fully support the new 12-year warranty option.
