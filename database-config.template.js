// Database Configuration Template for Tiamat Solar Loan Calculator
// Copy this file to database-config.js and fill in your actual values

// Database connection configuration
const databaseConfig = {
    // Option 1: Connection string (recommended)
    connectionString: 'postgresql://username:password@localhost:5432/database_name',
    
    // Option 2: Individual parameters
    host: 'localhost',
    port: 5432,
    database: 'tiamat_loan_calculator',
    user: 'your_username',
    password: 'your_password',
    
    // SSL configuration (required for some cloud databases)
    ssl: {
        rejectUnauthorized: false
    }
};

// Example configurations for different environments:

// Local PostgreSQL
const localConfig = {
    connectionString: 'postgresql://postgres:password@localhost:5432/tiamat_loan_calculator'
};

// Supabase
const supabaseConfig = {
    connectionString: 'postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
};

// Railway
const railwayConfig = {
    connectionString: 'postgresql://postgres:[YOUR-PASSWORD]@containers-us-west-[XX].railway.app:5432/railway',
    ssl: { rejectUnauthorized: false }
};

// To use this configuration:
// 1. Copy this file to database-config.js
// 2. Update the values with your actual database credentials
// 3. Import and use in your server.js file

module.exports = databaseConfig;
