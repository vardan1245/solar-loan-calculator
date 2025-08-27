# Inverter Type Implementation

## Overview
This document describes the implementation of a new `type` column in the `inverter_options` table to categorize inverters as on-grid, off-grid, or hybrid systems.

## Changes Made

### 1. Database Schema Changes

#### New Enum Type
- **Name**: `inverter_type`
- **Values**: 
  - `'on_grid'` - Grid-tied inverters (default)
  - `'off_grid'` - Standalone/off-grid inverters
  - `'hybrid'` - Hybrid inverters with battery backup capability

#### New Column
- **Table**: `inverter_options`
- **Column**: `type`
- **Data Type**: `inverter_type` (enum)
- **Default Value**: `'on_grid'`
- **Nullable**: `NOT NULL`
- **Index**: `idx_inverter_options_type` for performance

### 2. Migration Scripts

#### `add-inverter-type-column.sql`
- Creates the `inverter_type` enum
- Adds the `type` column to `inverter_options` table
- Sets default value to `'on_grid'` for all existing records
- Creates an index on the new column
- Includes verification queries

#### `rollback-inverter-type-column.sql`
- Removes the `type` column
- Drops the `inverter_type` enum
- Removes the index
- Includes verification queries

### 3. API Updates

#### `/api/inverters` Endpoint
- Now includes `type` field in the response
- Added documentation for the new field
- Maintains backward compatibility with default `'on_grid'` value

#### `/api/pricing-complete` Endpoint
- Includes `type` field in inverter data
- Maintains backward compatibility

### 4. Backward Compatibility
- All existing inverters automatically get `'on_grid'` type
- API responses include default values for records without type
- No breaking changes to existing functionality

## Usage

### Setting Inverter Types
```sql
-- Update specific inverters to different types
UPDATE inverter_options 
SET type = 'off_grid' 
WHERE name LIKE '%Off Grid%';

UPDATE inverter_options 
SET type = 'hybrid' 
WHERE name LIKE '%Hybrid%';
```

### Querying by Type
```sql
-- Get all on-grid inverters
SELECT * FROM inverter_options WHERE type = 'on_grid';

-- Get all off-grid inverters
SELECT * FROM inverter_options WHERE type = 'off_grid';

-- Get all hybrid inverters
SELECT * FROM inverter_options WHERE type = 'hybrid';
```

### API Usage
```javascript
// The type field is now included in API responses
fetch('/api/inverters')
  .then(response => response.json())
  .then(data => {
    data.data.inverters.forEach(inverter => {
      console.log(`${inverter.name}: ${inverter.type}`);
    });
  });
```

## Testing

### Test Script
Run `test-inverter-type.js` to verify:
1. Enum type creation
2. Column addition
3. Index creation
4. Data population
5. API functionality

### Manual Verification
```sql
-- Check table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'inverter_options' 
ORDER BY ordinal_position;

-- Check data
SELECT id, name, type, is_active 
FROM inverter_options 
ORDER BY kw;
```

## Benefits

1. **Better Categorization**: Clear distinction between inverter types
2. **Improved Filtering**: Can filter inverters by type in queries
3. **Enhanced API**: More detailed inverter information
4. **Future Flexibility**: Easy to add new inverter types
5. **Performance**: Indexed column for fast queries

## Next Steps

1. **Run Migration**: Execute `add-inverter-type-column.sql`
2. **Test Changes**: Run `test-inverter-type.js`
3. **Update Frontend**: Add type display in UI if needed
4. **Populate Types**: Update specific inverters with correct types
5. **Document**: Update any relevant documentation

## Rollback
If issues arise, use `rollback-inverter-type-column.sql` to revert all changes.

