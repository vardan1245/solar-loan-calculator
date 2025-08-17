# 🚀 Panel Database Setup for Solar Calculator

This guide explains how to populate your `panel_options` table with solar panel data, including the requested **LA Solar 580W** panel.

## 📋 **Available Scripts**

### 1. **Simple SQL Script** (`add-la-solar-panel.sql`)
- Adds only the LA Solar 580W panel
- Quick setup for testing

### 2. **Comprehensive Database** (`comprehensive-panel-database.sql`)
- Adds 8 different panel options
- Includes various brands, wattages, and price points
- Good for production use

### 3. **Node.js Script** (`populate-panels.js`)
- Automated database population
- Includes verification and error handling
- Easy to modify and extend

## 🔧 **Setup Options**

### **Option A: Direct SQL Execution**
```bash
# Connect to your database and run:
psql -U your_username -d your_database -f comprehensive-panel-database.sql
```

### **Option B: Node.js Script**
```bash
# Install dependencies (if not already installed)
npm install pg

# Set your database connection string
export DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Run the script
node populate-panels.js
```

### **Option C: Manual Database Entry**
Use your database management tool (pgAdmin, DBeaver, etc.) to run the SQL commands manually.

## 📊 **Panel Data Included**

### **LA Solar 580W (As Requested)**
- **Brand**: LA Solar
- **Model**: LA-580M
- **Wattage**: 580W
- **Price**: 0.85 AMD per watt
- **Efficiency**: 21.5%
- **Cell Type**: Monocrystalline PERC
- **Warranty**: 25 years

### **Additional Panels**
- **High Power**: 500W panels from Jinko, Longi, Canadian Solar
- **Standard**: 450W panels from various manufacturers
- **Residential**: 400W panels for smaller installations
- **Budget**: 300W polycrystalline options

## 💰 **Pricing Structure**
- **High Power (500W+)**: 0.87-0.89 AMD/W
- **Standard (400-499W)**: 0.81-0.83 AMD/W
- **Residential (300-399W)**: 0.77-0.79 AMD/W
- **Budget (300W)**: 0.71-0.72 AMD/W

## ✅ **Verification**

After running any script, verify the data:
```sql
SELECT 
    brand, 
    model, 
    wattage, 
    price_per_watt, 
    efficiency, 
    cell_type, 
    warranty_years,
    ROUND(wattage * price_per_watt, 0) as total_price_amd
FROM panel_options 
ORDER BY wattage DESC, brand, model;
```

## 🎯 **Next Steps**

Once the panel database is populated:
1. **Test the API**: `GET /api/panels` should return panel data
2. **Implement UI**: Add panel selection to the frontend
3. **Update Calculations**: Include panel costs in system calculations
4. **Test Integration**: Ensure everything works together

## 🔍 **Customization**

To add your own panels or modify specifications:
1. Edit the `panelData` array in `populate-panels.js`
2. Update the SQL scripts with your specifications
3. Adjust pricing based on your local market
4. Add more brands/models as needed

## 📞 **Support**

If you need help with:
- **Database connection issues**
- **Custom panel specifications**
- **Pricing adjustments**
- **Additional panel models**

Just let me know and I'll help you customize the data for your specific needs!
