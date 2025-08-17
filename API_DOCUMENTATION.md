# Tiamat Solar Loan Calculator API Documentation

## Overview
This API provides access to all system cost settings for the Tiamat Solar Loan Calculator. The `system_cost_settings` table contains configuration data for solar inverters, installation prices, profit margins, percentages, and bank loan options.

## Database Schema: system_cost_settings

### Table Structure
```sql
CREATE TABLE system_cost_settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    kw DECIMAL(5,2),           -- For inverters
    price INTEGER,              -- For inverters and base prices
    installation_type VARCHAR(50), -- For base prices
    warranty_years INTEGER,     -- For profit margins
    profit_per_kw INTEGER,      -- For profit margins
    value DECIMAL(5,4),        -- For percentages
    bank_name VARCHAR(100),     -- For bank configurations
    interest_rate DECIMAL(5,4), -- For bank configurations
    commission DECIMAL(5,4),    -- For bank configurations
    loan_period INTEGER,        -- For bank configurations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Field Descriptions

### 1. **inverter** Category
**Purpose**: Solar inverter options with power capacity and pricing
- **`kw`**: Kilowatt capacity of the inverter system (e.g., 3.0, 5.3, 10.0)
- **`price`**: Price in Armenian Dram (AMD) for the inverter
- **`name`**: Human-readable name (e.g., "3 kW Inverter", "10 kW Inverter")

**Available Values**:
- kW range: 3.0 to 110.0 kW
- Price range: 202,000 to 1,728,000 AMD

### 2. **base_price** Category
**Purpose**: Base installation prices per kW (excluding inverter cost)
- **`installation_type`**: Type of installation method
  - `onRoof`: Standard roof installation
  - `metalConstructionOnRoof`: Metal construction on roof
  - `systemOnGround`: Ground-mounted system
  - `aluminiumConstructionOnRoof`: Aluminium construction on roof
- **`price`**: Base price per kW in Armenian Dram (AMD)

**Available Values**:
- onRoof: 105,000 AMD/kW
- metalConstructionOnRoof: 115,000 AMD/kW
- systemOnGround: 117,000 AMD/kW
- aluminiumConstructionOnRoof: 130,000 AMD/kW

### 3. **profit_margin** Category
**Purpose**: Profit margins per kW based on warranty period
- **`warranty_years`**: Warranty period in years
- **`profit_per_kw`**: Profit margin per kW in Armenian Dram (AMD)

**Available Values**:
- 2 years: 15,000 AMD/kW
- 3 years: 20,000 AMD/kW
- 6 years: 25,000 AMD/kW
- 12 years: 30,000 AMD/kW

### 4. **percentage** Category
**Purpose**: System-wide percentage values for calculations
- **`name`**: Percentage identifier
  - `salesTeam`: Sales team commission percentage
  - `unexpectedExpenses`: Unexpected expenses buffer percentage
- **`value`**: Percentage value as decimal (e.g., 0.06 = 6%)

**Available Values**:
- salesTeam: 6% (0.06)
- unexpectedExpenses: 2% (0.02)

### 5. **bank** Category
**Purpose**: Bank loan options with interest rates and commissions
- **`bank_name`**: Name of the bank
- **`interest_rate`**: Annual interest rate as decimal (e.g., 0.12 = 12%)
- **`commission`**: Commission rate as decimal (e.g., 0.21 = 21%)
- **`loan_period`**: Loan period in months

**Available Banks**:
1. **ArmEconomBank**:
   - Interest rates: 0%, 3%, 5%, 9%, 12%, 15%
   - Loan periods: 36, 60, 84 months
   - Commission rates: 2% to 41% (varies by interest rate and period)

2. **ACBA Bank**:
   - Interest rate: 11%
   - Loan period: 96 months
   - Commission rate: 4%

## API Endpoints

### 1. Get All System Cost Settings
```
GET /api/system-cost-settings
```

**Response**: Comprehensive data organized by category with field descriptions
```json
{
  "success": true,
  "message": "System cost settings retrieved successfully",
  "data": {
    "inverters": { ... },
    "basePrices": { ... },
    "profitMargins": { ... },
    "percentages": { ... },
    "bankConfigurations": { ... }
  },
  "totalRecords": 45,
  "categories": ["inverters", "basePrices", "profitMargins", "percentages", "bankConfigurations"],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

### 2. Get Specific Category
```
GET /api/system-cost-settings/:category
```

**Categories**: `inverter`, `base_price`, `profit_margin`, `percentage`, `bank`

### 3. Get All Values for a Specific Field
```
GET /api/system-cost-settings/values/:field
```

**Available Fields**: `kw`, `price`, `installation_type`, `warranty_years`, `profit_per_kw`, `value`, `bank_name`, `interest_rate`, `commission`, `loan_period`

### 4. Get Summary Statistics
```
GET /api/system-cost-settings/summary
```

**Response**: Statistical overview of all categories including min/max values and averages

### 5. Update a Setting
```
PUT /api/system-cost-settings/:id
```

**Body Parameters**: `value`, `price`, `profit_per_kw`, `interest_rate`, `commission`

## Usage Examples

### Frontend Integration
```javascript
// Get all settings
const response = await fetch('/api/system-cost-settings');
const settings = await response.json();

// Access inverter options
const inverters = settings.data.inverters.data;
const inverterOptions = inverters.map(inv => ({
    label: inv.name,
    value: inv.kw,
    price: inv.price
}));

// Access installation types
const installationTypes = Object.keys(settings.data.basePrices.data);
const basePrices = Object.values(settings.data.basePrices.data);

// Access bank options
const banks = settings.data.bankConfigurations.data;
const bankOptions = banks.flatMap(bank => 
    bank.options.map(option => ({
        bank: bank.name,
        interestRate: option.interestRate,
        commission: option.commission,
        period: option.loan_period
    }))
);
```

### Field Value Queries
```javascript
// Get all available kW values
const kwResponse = await fetch('/api/system-cost-settings/values/kw');
const kwData = await kwResponse.json();
console.log('Available kW values:', kwData.data.map(row => row.kw));

// Get all installation types
const installResponse = await fetch('/api/system-cost-settings/values/installation_type');
const installData = await installResponse.json();
console.log('Installation types:', installData.data.map(row => row.installation_type));
```

## Data Relationships

### Price Calculations
- **Total System Cost** = (Base Price × System Size) + Inverter Price + (Profit Margin × System Size)
- **Sales Commission** = Total System Cost × salesTeam percentage
- **Unexpected Expenses** = Total System Cost × unexpectedExpenses percentage

### Bank Loan Calculations
- **Monthly Payment** = Principal × (Interest Rate + Commission) / (1 - (1 + Interest Rate)^(-Loan Period))
- **Total Interest** = (Monthly Payment × Loan Period) - Principal

## Testing

Run the test script to verify all endpoints:
```bash
node test-api.js
```

This will test all API endpoints and provide sample data output.

## Notes

- All prices are in Armenian Dram (AMD)
- Interest rates and percentages are stored as decimals (e.g., 0.12 for 12%)
- Loan periods are in months
- The API automatically handles data type conversions (string to number)
- All endpoints include error handling and success indicators
- The database includes automatic timestamp updates via triggers
