# Inverter Type Frontend Implementation

## Overview
This document describes the frontend implementation of the inverter type selection feature in the Tiamat Solar Loan Calculator. Users can now select the type of inverter system (on-grid, off-grid, or hybrid) and the inverter selection will be filtered accordingly.

## Changes Made

### 1. UI Updates

#### New Inverter Type Dropdown
- **Location**: Added to System Configuration section between Installation Type and Warranty Years
- **Grid Layout**: Changed from 4 columns to 5 columns to accommodate the new dropdown
- **Options**: 
  - `on_grid` - On Grid (Ցանցային)
  - `off_grid` - Off Grid (Ավտոնոմ) 
  - `hybrid` - Hybrid (Հիբրիդ)

#### Updated Files
- `index.html` - Main application file
- `index-backup.html` - Backup file (updated to 4 columns)

### 2. Functionality Updates

#### Inverter Filtering
- **Auto Selection**: Inverter dropdown now filters options by selected type
- **Manual Selection**: Brand and power dropdowns also filter by selected type
- **Fallback**: If no inverters of selected type exist, shows appropriate message
- **Backward Compatibility**: Handles inverters without type field (defaults to 'on_grid')

#### Updated Functions
- `populateInverterDropdown()` - Now filters by inverter type
- `populateManualBrands()` - Filters brands by inverter type
- `populateManualPowers()` - Filters power options by inverter type

### 3. Event Handling

#### New Event Listeners
- **Change Event**: Updates inverter dropdown and recalculates when type changes
- **Input Event**: Real-time updates for responsive user experience
- **Integration**: Triggers panel requirement calculations and loan recalculations

#### Event Flow
1. User selects inverter type
2. Inverter dropdown updates with filtered options
3. Panel suggestions recalculate based on new inverter selection
4. Loan calculations update automatically

### 4. User Experience Improvements

#### Visual Feedback
- Inverter options show type in parentheses: "Brand Model - 5 kW (on_grid)"
- Armenian translations for all type labels
- Clear messaging when no inverters of selected type are available

#### Responsive Updates
- Real-time filtering as user types/changes selection
- Immediate recalculation of system costs
- Seamless integration with existing auto-recalculation system

## Technical Implementation

### Filtering Logic
```javascript
// Filter inverters by selected type first
const typeFilteredInverters = inverters.filter(inverter => 
    inverter.type === selectedInverterType || !inverter.type || inverter.type === 'on_grid'
);
```

### Event Handler Structure
```javascript
document.getElementById('inverterType').addEventListener('change', function() {
    // Update inverter dropdown with filtered options
    populateInverterDropdown();
    
    // Update panel suggestions immediately when inverter type changes
    calculatePanelRequirements();
    
    // Auto-recalculate when inverter type changes
    autoRecalculate();
});
```

### Language Support
- **English**: "On Grid", "Off Grid", "Hybrid"
- **Armenian**: "Ցանցային", "Ավտոնոմ", "Հիբրիդ"
- **Dynamic**: All messages and labels support both languages

## Usage

### For Users
1. **Select Inverter Type**: Choose from On Grid, Off Grid, or Hybrid
2. **Automatic Filtering**: Inverter options automatically filter to show only relevant types
3. **System Updates**: All calculations update automatically based on selection
4. **Manual Override**: Can still use manual selection mode if needed

### For Developers
1. **API Integration**: Frontend expects `type` field in inverter API responses
2. **Event Handling**: New event listeners for `inverterType` element
3. **Filtering**: All inverter-related functions now respect type filtering
4. **Extensibility**: Easy to add new inverter types in the future

## Benefits

1. **Better System Design**: Users can specify exact inverter type requirements
2. **Improved Accuracy**: Calculations based on correct inverter type
3. **Enhanced UX**: Clear filtering and immediate feedback
4. **Professional Appearance**: More comprehensive system configuration options
5. **Future-Proof**: Ready for additional inverter types

## Next Steps

1. **Database Migration**: Run `add-inverter-type-column.sql` to add type column
2. **Add Hybrid Inverters**: Populate database with hybrid inverter options
3. **Testing**: Verify filtering works correctly for all inverter types
4. **User Training**: Educate users on the new inverter type selection

## Files Modified

- `index.html` - Main implementation
- `index-backup.html` - Backup file updates
- `server.js` - API updates (already completed)

## Testing

### Manual Testing
1. Select different inverter types
2. Verify dropdown filtering works
3. Check that calculations update correctly
4. Test manual selection mode
5. Verify language switching works

### Automated Testing
- Run `test-inverter-type.js` to verify database changes
- Test API endpoints return type information
- Verify frontend filtering logic

## Rollback
If issues arise, the feature can be easily disabled by:
1. Hiding the inverter type dropdown
2. Removing type filtering from functions
3. Reverting to original 4-column grid layout
