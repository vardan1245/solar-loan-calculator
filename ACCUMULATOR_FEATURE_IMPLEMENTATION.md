# Accumulator Feature Implementation

## Overview
This document describes the implementation of the accumulator (battery storage) selection feature for hybrid solar systems in the Tiamat Loan Calculator.

## Features Implemented

### 1. Database Schema
- **New Table**: `accumulator_options` - Stores battery storage options
- **Fields**: 
  - `id`, `name`, `brand`, `model`
  - `capacity_kwh` - Battery capacity in kilowatt-hours
  - `voltage` - Battery voltage (typically 48V, 24V, etc.)
  - `price` - Price in Armenian Dram (AMD)
  - `cycle_life` - Number of charge/discharge cycles
  - `warranty_years` - Warranty period (default: 5 years)
  - `chemistry` - Battery chemistry (LiFePO4, NMC, etc.)
  - `dimensions`, `weight_kg`, `description`
  - `is_active`, `created_at`, `updated_at`

### 2. Backend API
- **New Endpoint**: `GET /api/accumulators` - Returns all active accumulator options
- **Updated Endpoint**: `GET /api/pricing-complete` - Now includes accumulator data
- **Data Structure**: Returns accumulator information with proper field descriptions

### 3. Frontend UI
- **Accumulator Selection Container**: Only visible when "Hybrid" inverter type is selected
- **Auto/Manual Toggle**: Switch between automatic and manual accumulator selection
- **Auto Selection**: Smart filtering based on system power requirements
- **Manual Selection**: Three dropdowns for brand, capacity, and chemistry

### 4. Smart Filtering Logic
- **Capacity Range**: 0.5x to 3x system power (kWh)
- **Recommended Capacity**: 1.5x system power for optimal storage
- **Auto-Selection**: Automatically selects the best suitable accumulator

### 5. Cost Integration
- **System Value Calculation**: Accumulator costs are included in panel suggestion cards
- **Main Calculation**: Accumulator costs are included in the main loan calculation
- **Cost Breakdown**: Shows accumulator costs in the detailed cost breakdown

## Technical Implementation

### Database Migration
```sql
-- File: create-accumulator-options-table.sql
-- Creates the accumulator_options table with sample data
-- Includes indexes for performance optimization
-- Creates trigger for automatic timestamp updates
```

### Backend Changes
```javascript
// File: server.js
// New /api/accumulators endpoint
// Updated /api/pricing-complete endpoint
// Added accumulator data to comprehensive pricing response
```

### Frontend Changes
```javascript
// File: index.html
// New accumulator selection UI
// JavaScript functions for accumulator management
// Updated calculation functions to include accumulator costs
// Event listeners for accumulator selection changes
```

## Sample Data Included
The migration includes 8 sample accumulator options:
- **Pylontech**: US2000B (2.4kWh), US3000C (3.5kWh)
- **Growatt**: ARK 2.5H (2.5kWh), ARK 5.0H (5.0kWh)
- **Victron**: Smart 12.8/200 (2.56kWh), Smart 25.6/200 (5.12kWh)
- **BYD**: Premium HVS (7.0kWh), Premium HVM (10.0kWh)

## User Experience Flow

### 1. Inverter Type Selection
- User selects "Hybrid" from inverter type dropdown
- Accumulator selection container becomes visible
- Auto-selection populates with suitable options

### 2. Accumulator Selection
- **Auto Mode**: System automatically selects best accumulator
- **Manual Mode**: User can select specific brand, capacity, and chemistry
- Real-time updates trigger recalculation

### 3. Cost Calculation
- Accumulator costs are included in system value calculations
- Panel suggestion cards show updated system values
- Main calculation includes accumulator in total system cost

## Files Modified

### New Files
- `create-accumulator-options-table.sql` - Database migration
- `rollback-accumulator-options-table.sql` - Rollback script

### Modified Files
- `server.js` - Added accumulator API endpoints
- `index.html` - Added accumulator UI and logic
- `index-backup.html` - Added accumulator UI

## Next Steps

### 1. Run Database Migration
```bash
# Execute the migration script
node run-accumulator-migration.js
```

### 2. Test the Feature
- Select "Hybrid" inverter type
- Verify accumulator selection appears
- Test auto and manual selection modes
- Verify costs are included in calculations

### 3. Add More Accumulator Options
- Add hybrid-specific inverters to `inverter_options` table
- Add more accumulator options for different use cases
- Consider adding off-grid accumulator options

## Benefits

### 1. Enhanced System Configuration
- Users can now specify battery storage requirements
- Better cost estimation for hybrid systems
- More accurate system sizing

### 2. Improved User Experience
- Smart auto-selection reduces complexity
- Manual override for specific requirements
- Real-time cost updates

### 3. Business Value
- More accurate pricing for hybrid systems
- Better customer understanding of system costs
- Competitive advantage in hybrid market

## Technical Notes

### Performance Considerations
- Indexes on frequently queried fields (capacity_kwh, voltage, brand)
- Efficient filtering based on system power requirements
- Lazy loading of accumulator data

### Security
- No sensitive data in accumulator options
- Standard API authentication and validation
- Input sanitization for manual selections

### Maintainability
- Clear separation of concerns
- Consistent naming conventions
- Comprehensive error handling
- Easy to extend with new accumulator types
