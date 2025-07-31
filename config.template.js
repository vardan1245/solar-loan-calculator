// Configuration template file
// Copy this file to config.js and customize the values
// This file can be safely committed to git

const CONFIG = {
    // Admin password - CHANGE THIS TO YOUR OWN PASSWORD
    ADMIN_PASSWORD: 'YOUR_ADMIN_PASSWORD_HERE',
    
    // Bank configurations - CUSTOMIZE AS NEEDED
    BANK_CONFIGURATIONS: [
        {
            name: 'ArmEconomBank',
            options: [
                { interestRate: 0, commission: 0.21, periods: [36] },
                { interestRate: 0, commission: 0.32, periods: [60] },
                { interestRate: 0, commission: 0.41, periods: [84] },
                { interestRate: 0.03, commission: 0.18, periods: [36] },
                { interestRate: 0.03, commission: 0.27, periods: [60] },
                { interestRate: 0.03, commission: 0.34, periods: [84] },
                { interestRate: 0.05, commission: 0.16, periods: [36] },
                { interestRate: 0.05, commission: 0.23, periods: [60] },
                { interestRate: 0.05, commission: 0.3, periods: [84] },
                { interestRate: 0.09, commission: 0.1, periods: [36] },
                { interestRate: 0.09, commission: 0.15, periods: [60] },
                { interestRate: 0.09, commission: 0.19, periods: [84] },
                { interestRate: 0.12, commission: 0.06, periods: [36] },
                { interestRate: 0.12, commission: 0.09, periods: [60] },
                { interestRate: 0.12, commission: 0.11, periods: [84] },
                { interestRate: 0.15, commission: 0.02, periods: [36] },
                { interestRate: 0.15, commission: 0.03, periods: [60] },
                { interestRate: 0.15, commission: 0.04, periods: [84] }
            ]
        },
        {
            name: 'ACBA Bank',
            options: [
                { interestRate: 0.11, commission: 0.04, periods: [96] }
            ]
        }
    ],
    
    // Inverter list with prices - UPDATE PRICES AS NEEDED
    INVERTERS: [
        { kw: 3, price: 201600 },
        { kw: 3.6, price: 208800 },
        { kw: 5.3, price: 237600 },
        { kw: 6, price: 396000 },
        { kw: 8, price: 417600 },
        { kw: 10, price: 432000 },
        { kw: 12, price: 446400 },
        { kw: 15, price: 460800 },
        { kw: 20, price: 532800 },
        { kw: 25, price: 576000 },
        { kw: 30, price: 936000 },
        { kw: 40, price: 1036800 },
        { kw: 50, price: 1094400 },
        { kw: 60, price: 1180800 },
        { kw: 75, price: 1260000 },
        { kw: 100, price: 1648800 },
        { kw: 110, price: 1728000 }
    ],
    
    // Base prices per kW (without inverter) - UPDATE PRICES AS NEEDED
    BASE_PRICES: {
        aluminiumConstructionOnRoof: 130000,
        metalConstructionOnRoof: 115000,
        onRoof: 105000,
        systemOnGround: 117000
    },
    
    // Profit per kW by warranty years - ADJUST PROFIT MARGINS AS NEEDED
    PROFIT_BY_WARRANTY: {
        2: 15000,
        3: 20000,
        6: 25000,
        12: 30000
    },
    
    // Sales team and unexpected expenses percentages - ADJUST AS NEEDED
    PERCENTAGES: {
        salesTeam: 0.06, // 6%
        unexpectedExpenses: 0.02 // 2%
    }
}; 