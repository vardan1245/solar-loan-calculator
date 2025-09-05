# Bank Configuration Installation Type Filtering Implementation

## Overview
This implementation adds installation type filtering to bank configurations, allowing specific bank configurations to be available only for certain installation types. Bank configurations with IDs 19 and 20 are now restricted to "On Roof" and "Aluminium Construction on Roof" installation types only.

## Changes Made

### 1. Database Schema Updates

#### Added Installation Type Column
- **Table**: `bank_configurations`
- **New Column**: `installation_type VARCHAR(50)`
- **Index**: Added `idx_bank_configurations_installation_type` for performance
- **Migration**: Applied via Supabase migration system

#### Updated Bank Configurations
- **ID 19**: ACBA Bank (11% interest, 4% commission, 96 months)
  - `installation_type`: `'onRoof,aluminiumConstructionOnRoof'`
- **ID 20**: ՉԳԱԶԱՖԻԿԱՑՎԱԾ ՀԱՄՅՆՔՆԵՐՈՒՄ ACBA Bank (9% interest, 4% commission, 96 months)
  - `installation_type`: `'onRoof,aluminiumConstructionOnRoof'`
- **All Other Configurations**: `installation_type` set to `NULL` (available for all installation types)

### 2. API Endpoint Updates

#### Enhanced `/api/banks` Endpoint
- **New Parameter**: `installationType` (optional query parameter)
- **Filtering Logic**: 
  - If `installationType` provided: Returns configurations where `installation_type IS NULL OR installation_type LIKE '%{installationType}%'`
  - If no parameter: Returns all active configurations (backward compatibility)
- **Response Format**: Unchanged, maintains existing structure

#### Enhanced `/api/pricing-complete` Endpoint
- **New Parameter**: `installationType` (optional query parameter)
- **Filtering**: Same logic as `/api/banks` endpoint
- **Integration**: Seamlessly integrated with existing comprehensive pricing data

### 3. Frontend Updates

#### New Function: `fetchBankConfigurationsForInstallationType()`
- **Purpose**: Fetches bank configurations filtered by installation type
- **Parameters**: `installationType` (string)
- **Behavior**: Updates global `bankConfigurations` variable with filtered results
- **Error Handling**: Comprehensive error handling with console logging

#### Enhanced Event Listeners
- **Installation Type Change**: Added bank configuration refetching to both `change` and `input` event listeners
- **Real-time Updates**: Bank configurations update immediately when installation type changes
- **Integration**: Seamlessly integrated with existing recalculation logic

### 4. Filtering Logic

#### Installation Type Values
- `onRoof`: Standard roof installation
- `metalConstructionOnRoof`: Metal construction on roof  
- `systemOnGround`: Ground-mounted system
- `aluminiumConstructionOnRoof`: Aluminium construction on roof

#### Bank Configuration Availability
- **IDs 19 & 20**: Available only for `onRoof` and `aluminiumConstructionOnRoof`
- **All Others**: Available for all installation types (backward compatibility)

## Testing Results

### API Endpoint Testing
```bash
# Test 1: onRoof installation type
curl "http://localhost:3001/api/banks?installationType=onRoof"
# Result: ✅ IDs 19 & 20 included

# Test 2: aluminiumConstructionOnRoof installation type  
curl "http://localhost:3001/api/banks?installationType=aluminiumConstructionOnRoof"
# Result: ✅ IDs 19 & 20 included

# Test 3: systemOnGround installation type
curl "http://localhost:3001/api/banks?installationType=systemOnGround"
# Result: ✅ IDs 19 & 20 excluded
```

### Frontend Integration
- **Real-time Filtering**: Bank configurations update immediately when installation type changes
- **User Experience**: Seamless integration with existing loan calculation flow
- **Backward Compatibility**: No breaking changes to existing functionality

## Database Migration Details

### Migration Applied
- **Name**: `add_installation_type_to_bank_configurations`
- **Status**: ✅ Successfully applied to Supabase project `ylmcwkabyqvgdrbnunri`
- **Timestamp**: Applied during implementation

### Verification Query
```sql
SELECT 
    id,
    bank_name,
    name,
    installation_type,
    interest_rate,
    commission,
    loan_period
FROM bank_configurations 
WHERE id IN (19, 20)
ORDER BY id;
```

## Benefits

1. **Flexible Configuration**: Bank configurations can now be restricted to specific installation types
2. **Backward Compatibility**: Existing configurations remain available for all installation types
3. **Performance**: Indexed column for efficient filtering
4. **User Experience**: Real-time updates when installation type changes
5. **Maintainability**: Clean separation of concerns between database, API, and frontend

## Future Enhancements

1. **Admin Interface**: Add UI for managing bank configuration installation type restrictions
2. **Multiple Types**: Support for multiple installation types per configuration
3. **Validation**: Add validation to ensure installation type values are valid
4. **Audit Trail**: Track changes to installation type restrictions

## Files Modified

- `server.js`: Enhanced API endpoints with installation type filtering
- `index.html`: Added frontend function and event listeners
- Database: Applied migration to add `installation_type` column

## Files Created (Temporary)
- `add-installation-type-to-bank-configurations.sql`: Migration script (deleted after use)
- `run-bank-config-migration.js`: Migration runner (deleted after use)

## Files Created (Permanent)
- `BANK_CONFIGURATION_INSTALLATION_TYPE_FILTERING.md`: This documentation
