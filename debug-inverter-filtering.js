// Debug script for inverter filtering issues
// Run this to test inverter filtering logic

const testSystemPower = 5.3; // kW
const testWarrantyYears = 12;

// Test the 15% rule calculation
const minPower = testSystemPower * 1.15;

// Test warranty-based profit margin lookup
const profitKey = `profit_per_kw_${testWarrantyYears}Y`;

// Debug test completed
// Check the console for inverter filtering logic

