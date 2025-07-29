# Solar Loan Calculator

A standalone web application for calculating and comparing solar system loan options from different banks in Armenia.

## Features

- **System Configuration**: Input system power, cost, profit, and percentage settings
- **Real-time Calculations**: Instant calculation of loan options
- **Bank Comparison**: Compare loan terms from multiple banks
- **Detailed Breakdown**: View loan amount, monthly payments, total interest, and total amount
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

[View the live calculator](https://your-username.github.io/solar-loan-calculator)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/solar-loan-calculator.git
cd solar-loan-calculator
```

2. Install dependencies (optional, for development):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Input Parameters

- **System Power (kW)**: The total power of the solar system
- **Installation Type**: Type of solar installation (On Roof, Metal Construction, etc.)
- **Cost per kW (AMD)**: Cost per kilowatt in Armenian Drams
- **Profit per kW (AMD)**: Profit margin per kilowatt
- **Sales Team (%)**: Sales team commission percentage
- **Unanticipated Expenses (%)**: Buffer for unexpected costs
- **Down Payment (AMD)**: Initial payment amount

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

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://your-username.github.io/solar-loan-calculator`

### Other Hosting Services

- **Netlify**: Drag and drop the `index.html` file
- **Vercel**: Connect your GitHub repository
- **Any static hosting**: Upload the files to your web server

## Development

### Project Structure

```
solar-loan-calculator/
├── index.html          # Main application file
├── package.json        # Project configuration
├── README.md          # This file
├── .gitignore         # Git ignore rules
└── LICENSE            # MIT License
```

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Styling with Tailwind CSS
- **JavaScript**: Vanilla JS for calculations
- **Tailwind CSS**: Utility-first CSS framework

### Customization

To add new banks or modify existing ones, edit the `bankConfigurations` array in `index.html`:

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

### Version 1.0.0
- Initial release
- Basic loan calculation functionality
- Support for ArmEconomBank and ACBA Bank
- Responsive design
- Real-time calculations 