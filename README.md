# Solar Loan Calculator with Database Integration

A standalone web application for calculating and comparing solar system loan options from different banks in Armenia, with full database integration for persistent settings.

## Features

- **Database Integration**: Settings are stored and retrieved from Supabase database
- **System Configuration**: Input system power, cost, profit, and percentage settings
- **Real-time Calculations**: Instant calculation of loan options
- **Bank Comparison**: Compare loan terms from multiple banks
- **Detailed Breakdown**: View loan amount, monthly payments, total interest, and total amount
- **Responsive Design**: Works on desktop and mobile devices
- **Persistent Settings**: All configuration values are saved to database

## Live Demo

[View the live calculator](https://vardan1245.github.io/solar-loan-calculator)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vardan1245/solar-loan-calculator.git
cd solar-loan-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
echo "SUPABASE_URL=https://ylmcwkabyqvgdrbnunri.supabase.co" > .env
echo "SUPABASE_ANON_KEY=your-supabase-anon-key" >> .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Database Setup

This application requires a Supabase database with the following setup:

### Required Tables

1. **system_cost_settings** table:
```sql
CREATE TABLE system_cost_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value NUMERIC NOT NULL,
    description TEXT
);
```

2. **Required Database Function**:
```sql
CREATE OR REPLACE FUNCTION get_system_cost_settings()
RETURNS TABLE (
    setting_key text,
    setting_value numeric,
    description text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.setting_key::text,
        s.setting_value,
        COALESCE(s.description, '')::text
    FROM system_cost_settings s
    WHERE s.setting_key IN (
        'on_roof_cost_per_kw',
        'metal_construction_on_roof_cost_per_kw',
        'aluminium_construction_on_roof_cost_per_kw',
        'system_on_ground_cost_per_kw',
        'on_roof_profit_per_kw',
        'metal_construction_on_roof_profit_per_kw',
        'aluminium_construction_on_roof_profit_per_kw',
        'system_on_ground_profit_per_kw',
        'on_roof_sales_pct',
        'metal_roof_sales_pct',
        'aluminium_roof_sales_pct',
        'ground_system_sales_pct',
        'on_roof_unexp_pct',
        'metal_roof_unexp_pct',
        'aluminium_roof_unexp_pct',
        'ground_unexp_pct'
    )
    ORDER BY s.setting_key;
END;
$$;
```

## Usage

### Input Parameters

- **System Power (kW)**: The total power of the solar system
- **Installation Type**: Type of solar installation (On Roof, Metal Construction, etc.)
- **Cost per kW (AMD)**: Cost per kilowatt in Armenian Drams
- **Profit per kW (AMD)**: Profit margin per kilowatt
- **Sales Team (%)**: Sales team commission percentage
- **Unanticipated Expenses (%)**: Buffer for unexpected costs
- **Down Payment (AMD)**: Initial payment amount

### Database Integration

The application automatically:
- **Loads settings** from the database when you change installation type
- **Saves settings** to the database when you calculate loan options
- **Persists values** between sessions and users

### Calculation Formula

The calculator uses the following formula:

```
System Value for Cash = (System Power × (Cost per kW + Profit per kW)) / (1 - Sales Team % - Unanticipated Expenses %)
```

For loan calculations:
```
Loan Amount = (System Power × (Cost per kW + Profit per kW)) / (1 - Sales Team % - Unanticipated Expenses % - Bank Commission %)
```

### Output Information

The calculator provides:

- **Base Value**: Raw cost + profit calculation
- **System Value for Cash**: Total value without bank commission
- **Loan Options Table**: Detailed comparison of all available loan options

## Supported Banks

### ArmEconomBank
- Multiple interest rates (0% to 15%)
- Commission rates from 2% to 41%
- Loan periods: 36, 60, and 84 months

### ACBA Bank
- 11% interest rate
- 4% commission
- 96-month loan period

## API Endpoints

### GET /api/system-settings
Returns all system cost settings from the database.

### POST /api/update-setting
Updates a specific setting in the database.
Body: `{ "settingKey": "string", "settingValue": number }`

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

1. **Heroku**:
   ```bash
   heroku create your-app-name
   heroku config:set SUPABASE_URL=your-supabase-url
   heroku config:set SUPABASE_ANON_KEY=your-supabase-key
   git push heroku main
   ```

2. **Railway**:
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

3. **Vercel**:
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PORT`: Server port (default: 3000)

## Development

### Project Structure

```
solar-loan-calculator/
├── server.js              # Express server with API endpoints
├── public/
│   └── index.html         # Main application file
├── package.json           # Project configuration
├── README.md             # This file
├── .gitignore            # Git ignore rules
└── LICENSE               # MIT License
```

### Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS
- **API**: RESTful endpoints

### Customization

To add new banks or modify existing ones, edit the `bankConfigurations` array in `public/index.html`:

```javascript
const bankConfigurations = [
    {
        name: 'New Bank',
        options: [
            { interestRate: 0.10, commission: 0.05, periods: [60] }
        ]
    }
];
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@tiamatsolar.com or create an issue in this repository.

## Changelog

### Version 1.1.0
- Added database integration with Supabase
- Settings are now persisted between sessions
- Added API endpoints for CRUD operations
- Improved error handling and validation

### Version 1.0.0
- Initial release
- Basic loan calculation functionality
- Support for ArmEconomBank and ACBA Bank
- Responsive design
- Real-time calculations 