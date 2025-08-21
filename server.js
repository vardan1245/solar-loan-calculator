import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://tiamat-loan-calculator-project.vercel.app',
        'https://tiamat-loan-calculator-project-cqdnxodg8.vercel.app',
        'https://tiamat-loan-calculator-project-3xzq7kpbe.vercel.app',
        'https://*.vercel.app',
        'https://loan.tiamat.am'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Add request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());

// Database connection - using Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
        
    } else {
        
    }
});

// Supabase authentication middleware
async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Authentication required',
                message: 'Please log in to access this resource'
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify the Supabase JWT token
        let supabase;
        try {
            const { createClient } = await import('@supabase/supabase-js');
            supabase = createClient(
                process.env.SUPABASE_URL || 'https://ylmcwkabyqvgdrbnunri.supabase.co',
                process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTI3MjMsImV4cCI6MjA2MjUyODcyM30.UrsOv_NmOJilHeQu9-brBI_1N7PYbOCYHsqc4cy6YqY'
            );
        } catch (importError) {
            console.error('Failed to import Supabase client:', importError);
            return res.status(500).json({ 
                error: 'Server configuration error',
                message: 'Authentication service unavailable'
            });
        }
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ 
                error: 'Invalid token',
                message: 'Please log in again'
            });
        }
        
        // Check if user has admin role
        const isAdmin = (user.app_metadata && user.app_metadata.role === 'admin') ||
                       (user.user_metadata && user.user_metadata.role === 'admin') ||
                       user.email === 'admin@tiamat.com' ||
                       user.email === 'admin@gmail.com' ||
                       user.email === 'vardansargsyan97@gmail.com';
        
        if (!isAdmin) {
            return res.status(403).json({ 
                error: 'Access denied',
                message: 'Admin role required'
            });
        }
        
        // User is authenticated and has admin role
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            error: 'Authentication error',
            message: 'Internal server error'
        });
    }
}

// Public API Routes (no authentication required)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'Tiamat Solar CRM API is running'
    });
});

// Test endpoint for CORS debugging
app.get('/api/test-cors', (req, res) => {
    console.log('CORS test request received from:', req.headers.origin);
    res.json({ 
        status: 'cors-test-ok', 
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        message: 'CORS test successful'
    });
});

// Test endpoint for authentication debugging
app.get('/api/test-auth', requireAuth, (req, res) => {
    console.log('Auth test request received from:', req.headers.origin);
    res.json({ 
        status: 'auth-test-ok', 
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        user: req.user.email,
        message: 'Authentication test successful'
    });
});

// Get all system cost settings organized by category
app.get('/api/system-cost-settings', async (req, res) => {
    try {
        const query = 'SELECT * FROM system_cost_settings ORDER BY id';
        const result = await pool.query(query);
        
        // Organize data by installation type and setting category
        const organizedData = {
            installationCosts: {
                description: "Base installation costs per kW (excluding inverter and panels)",
                fields: {
                    setting_key: "Installation type identifier",
                    setting_value: "Cost per kW in Armenian Dram (AMD)"
                },
                data: {}
            },
            profitMargins: {
                description: "Profit margins per kW for each installation type",
                fields: {
                    setting_key: "Installation type identifier",
                    setting_value: "Profit margin per kW in Armenian Dram (AMD)"
                },
                data: {}
            },
            salesCommissions: {
                description: "Sales team commission percentages for each installation type",
                fields: {
                    setting_key: "Installation type identifier",
                    setting_value: "Commission percentage (e.g., 6.00 = 6%)"
                },
                data: {}
            },
            unanticipatedExpenses: {
                description: "Unanticipated expenses buffer percentages for each installation type",
                fields: {
                    setting_key: "Installation type identifier",
                    setting_value: "Expense buffer percentage (e.g., 2.00 = 2%)"
                },
                data: {}
            }
        };
        
        result.rows.forEach(row => {
            const key = row.setting_key;
            const value = parseFloat(row.setting_value);
            
            if (key.includes('cost_per_kw')) {
                const installationType = key.replace('_cost_per_kw', '');
                organizedData.installationCosts.data[installationType] = {
                    id: row.id,
                    key: key,
                    value: value,
                    description: row.description,
                    updated_at: row.updated_at
                };
            } else if (row.category === 'profit_margin') {
                // Handle warranty-based profit margins
                const warrantyYears = row.warranty_years;
                const profitKey = `profit_per_kw_${warrantyYears}Y`;
                organizedData.profitMargins.data[profitKey] = {
                    id: row.id,
                    key: profitKey,
                    value: value,
                    description: row.description,
                    updated_at: row.updated_at
                };
            } else if (key.includes('profit_per_kw')) {
                // Handle legacy installation-type-based profit keys (if any exist)
                const installationType = key.replace('_profit_per_kw', '');
                organizedData.profitMargins.data[installationType] = {
                    id: row.id,
                    key: key,
                    value: value,
                    description: row.description,
                    updated_at: row.updated_at
                };
            } else if (key.includes('sales_pct') || key.includes('sales_team_pct')) {
                // Handle both old sales_pct format and new sales_team_pct format
                if (key === 'sales_team_pct') {
                    // This is a common percentage for all installation types
                    organizedData.salesCommissions.data[key] = {
                        id: row.id,
                        key: key,
                        value: value,
                        description: row.description,
                        updated_at: row.updated_at
                    };
                } else {
                    // This is installation-specific sales percentage
                    const installationType = key.replace('_sales_pct', '');
                    organizedData.salesCommissions.data[installationType] = {
                        id: row.id,
                        key: key,
                        value: value,
                        description: row.description,
                        updated_at: row.updated_at
                    };
                }
            } else if (key.includes('unexp_pct') || key.includes('unanticipated_expenses_pct')) {
                const installationType = key.replace('_unexp_pct', '').replace('_unanticipated_expenses_pct', '');
                organizedData.unanticipatedExpenses.data[installationType] = {
                    id: row.id,
                    key: key,
                    value: value,
                    description: row.description,
                    updated_at: row.updated_at
                };
            }
        });
        
        res.json({
            success: true,
            message: "System cost settings retrieved successfully",
            data: organizedData,
            totalRecords: result.rows.length,
            categories: Object.keys(organizedData),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching system cost settings:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch system cost settings',
            details: error.message 
        });
    }
});

// Get all inverter options
app.get('/api/inverters', async (req, res) => {
    try {
        const query = 'SELECT * FROM inverter_options WHERE is_active = true ORDER BY kw';
        const result = await pool.query(query);
        
        res.json({
            success: true,
            message: "Inverter options retrieved successfully",
            data: {
                description: "Solar inverter options with power capacity and pricing",
                fields: {
                    kw: "Kilowatt capacity of the inverter system",
                    price: "Price in Armenian Dram (AMD)",
                    brand: "Manufacturer brand",
                    model: "Model number",
                    efficiency: "Efficiency percentage",
                    warranty_years: "Warranty period in years"
                },
                inverters: result.rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    kw: parseFloat(row.kw),
                    price: parseInt(row.price),
                    brand: row.brand,
                    model: row.model,
                    efficiency: parseFloat(row.efficiency),
                    warranty_years: parseInt(row.warranty_years),
                    description: row.description
                }))
            },
            totalInverters: result.rows.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching inverter options:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch inverter options',
            details: error.message 
        });
    }
});

// Get all photovoltaic panel options
app.get('/api/panels', async (req, res) => {
    try {
        const query = 'SELECT * FROM panel_options WHERE is_active = true ORDER BY wattage';
        const result = await pool.query(query);
        
        res.json({
            success: true,
            message: "Panel options retrieved successfully",
            data: {
                description: "Photovoltaic panel options with wattage and pricing",
                fields: {
                    wattage: "Panel power output in watts",
                    price: "Total panel price in Armenian Dram (AMD)",
                    price_per_watt: "Price per watt in Armenian Dram (AMD)",
                    brand: "Manufacturer brand",
                    model: "Model number",
                    efficiency: "Efficiency percentage",
                    cell_type: "Type of solar cells",
                    warranty_years: "Warranty period in years"
                },
                panels: result.rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    wattage: parseInt(row.wattage),
                    price: parseFloat(row.price), // Total panel price in AMD
                    price_per_watt: parseFloat(row.price_per_watt), // Use the calculated price_per_watt column
                    brand: row.brand,
                    model: row.model,
                    efficiency: parseFloat(row.efficiency),
                    cell_type: row.cell_type,
                    dimensions: row.dimensions,
                    weight_kg: parseFloat(row.weight_kg),
                    warranty_years: parseInt(row.warranty_years),
                    description: row.description
                }))
            },
            totalPanels: result.rows.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching panel options:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch panel options',
            details: error.message 
        });
    }
});

// Get all bank configurations
app.get('/api/banks', async (req, res) => {
    try {
        const query = 'SELECT * FROM bank_configurations WHERE is_active = true ORDER BY bank_name, interest_rate, loan_period';
        const result = await pool.query(query);
        
        // Organize by bank
        const organizedBanks = {};
        result.rows.forEach(row => {
            if (!organizedBanks[row.bank_name]) {
                organizedBanks[row.bank_name] = {
                    name: row.bank_name, // Changed from bank_name to name for frontend compatibility
                    options: []
                };
            }
            organizedBanks[row.bank_name].options.push({
                id: row.id,
                interestRate: parseFloat(row.interest_rate), // Changed from interest_rate to interestRate
                commission: parseFloat(row.commission),
                periods: [parseInt(row.loan_period)], // Changed from loan_period to periods array
                name: row.name,
                description: row.description
            });
        });
        
        res.json({
            success: true,
            message: "Bank configurations retrieved successfully",
            data: {
                description: "Bank loan options with interest rates and commissions",
                fields: {
                    bank_name: "Name of the bank",
                    interest_rate: "Annual interest rate as decimal (e.g., 0.12 = 12%)",
                    commission: "Commission rate as decimal (e.g., 0.21 = 21%)",
                    loan_period: "Loan period in months"
                },
                banks: Object.values(organizedBanks)
            },
            totalBanks: Object.keys(organizedBanks).length,
            totalOptions: result.rows.length,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching bank configurations:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch bank configurations',
            details: error.message 
        });
    }
});

// Get comprehensive pricing data (all tables combined)
app.get('/api/pricing-complete', async (req, res) => {
    try {
        // Get all data from all tables
        const [costSettings, inverters, panels, banks] = await Promise.all([
            pool.query('SELECT * FROM system_cost_settings ORDER BY id'),
            pool.query('SELECT * FROM inverter_options WHERE is_active = true ORDER BY kw'),
            pool.query('SELECT * FROM panel_options WHERE is_active = true ORDER BY wattage'),
            pool.query('SELECT * FROM bank_configurations WHERE is_active = true ORDER BY bank_name, interest_rate, loan_period')
        ]);
        
        // Organize cost settings
        const organizedCosts = {
            installationCosts: {},
            profitMargins: {},
            salesCommissions: {},
            unanticipatedExpenses: {}
        };
        
        costSettings.rows.forEach(row => {
            const key = row.setting_key;
            const value = parseFloat(row.setting_value);
            
            if (key.includes('cost_per_kw')) {
                const installationType = key.replace('_cost_per_kw', '');
                organizedCosts.installationCosts[installationType] = value;
            } else if (key.includes('profit_per_kw')) {
                const installationType = key.replace('_profit_per_kw', '');
                organizedCosts.profitMargins[installationType] = value;
            } else if (key.includes('sales_pct')) {
                const installationType = key.replace('_sales_pct', '');
                organizedCosts.salesCommissions[installationType] = value;
            } else if (key.includes('unexp_pct') || key.includes('unanticipated_expenses_pct')) {
                const installationType = key.replace('_unexp_pct', '').replace('_unanticipated_expenses_pct', '');
                organizedCosts.unanticipatedExpenses[installationType] = value;
            }
        });
        
        // Organize banks
        const organizedBanks = {};
        banks.rows.forEach(row => {
            if (!organizedBanks[row.bank_name]) {
                organizedBanks[row.bank_name] = [];
            }
            organizedBanks[row.bank_name].push({
                interest_rate: parseFloat(row.interest_rate),
                commission: parseFloat(row.commission),
                loan_period: parseInt(row.loan_period),
                name: row.name
            });
        });
        
        res.json({
            success: true,
            message: "Complete pricing data retrieved successfully",
            data: {
                systemCosts: organizedCosts,
                inverters: inverters.rows.map(row => ({
                    kw: parseFloat(row.kw),
                    price: parseInt(row.price),
                    name: row.name
                })),
                panels: panels.rows.map(row => ({
                    wattage: parseInt(row.wattage),
                    price_per_watt: parseFloat(row.price_per_watt),
                    name: row.name
                })),
                banks: organizedBanks
            },
            summary: {
                totalCostSettings: costSettings.rows.length,
                totalInverters: inverters.rows.length,
                totalPanels: panels.rows.length,
                totalBankOptions: banks.rows.length
            },
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching complete pricing data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch complete pricing data',
            details: error.message 
        });
    }
});

// Get specific category of settings
app.get('/api/system-cost-settings/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const query = 'SELECT * FROM system_cost_settings WHERE setting_key LIKE $1 ORDER BY id';
        const result = await pool.query(query, [`%${category}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching ${category} settings:`, error);
        res.status(500).json({ error: `Failed to fetch ${category} settings` });
    }
});

// Create new system cost setting
app.post('/api/system-cost-settings', async (req, res) => {
    try {
        const { setting_key, setting_value, description } = req.body;
        
        if (!setting_key || setting_value === undefined) {
            return res.status(400).json({ error: 'setting_key and setting_value are required' });
        }
        
        const query = 'INSERT INTO system_cost_settings (setting_key, setting_value, description) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [setting_key, setting_value, description]);
        
        res.status(201).json({
            success: true,
            message: 'Setting created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating system cost setting:', error);
        res.status(500).json({ error: 'Failed to create system cost setting', details: error.message });
    }
});

// Update system cost setting
app.put('/api/system-cost-settings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { setting_value, description } = req.body;
        
        const query = 'UPDATE system_cost_settings SET setting_value = $1, description = $2 WHERE id = $3 RETURNING *';
        const result = await pool.query(query, [setting_value, description, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating system cost setting:', error);
        res.status(500).json({ error: 'Failed to update system cost setting' });
    }
});

// Delete system cost setting
app.delete('/api/system-cost-settings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if the record exists
        const checkQuery = 'SELECT * FROM system_cost_settings WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        
        // Delete the record
        const deleteQuery = 'DELETE FROM system_cost_settings WHERE id = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);
        
        res.json({
            success: true,
            message: 'Setting deleted successfully',
            deletedRecord: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting system cost setting:', error);
        res.status(500).json({ error: 'Failed to delete system cost setting' });
    }
});

// Admin authentication endpoint - uses Supabase auth
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email and password are required' 
            });
        }
        
        // Use Supabase authentication
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL || 'https://ylmcwkabyqvgdrbnunri.supabase.co',
            process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTI3MjMsImV4cCI6MjA2MjUyODcyM30.UrsOv_NmOJilHeQu9-brBI_1N7PYbOCYHsqc4cy6YqY'
        );
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            return res.status(401).json({ 
                success: false, 
                error: error.message 
            });
        }
        
        const user = data.user;
        
        // Check if user has admin role
        const isAdmin = (user.app_metadata && user.app_metadata.role === 'admin') ||
                       (user.user_metadata && user.user_metadata.role === 'admin') ||
                       user.email === 'admin@tiamat.com' ||
                       user.email === 'admin@gmail.com' ||
                       user.email === 'vardansargsyan97@gmail.com';
        
        if (!isAdmin) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. Admin role required.' 
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            token: data.session.access_token,
            user: {
                id: user.id,
                email: user.email,
                full_name: (user.user_metadata && (user.user_metadata.name || user.user_metadata.full_name)) || user.email,
                role: 'admin'
            }
        });
        
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error during login' 
        });
    }
});

// Admin management endpoints
app.get('/api/admin/panel_options', requireAuth, async (req, res) => {
    try {
        console.log('Admin panel_options request received from:', req.headers.origin);
        console.log('User authenticated:', req.user.email);
        const query = 'SELECT * FROM panel_options WHERE is_active = true ORDER BY brand, wattage';
        const result = await pool.query(query);
        console.log(`Found ${result.rows.length} panel options`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching panel options:', error);
        res.status(500).json({ error: 'Failed to fetch panel options' });
    }
});

app.get('/api/admin/panel_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM panel_options WHERE id = $1 AND is_active = true';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Panel option not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching panel option:', error);
        res.status(500).json({ error: 'Failed to fetch panel option' });
    }
});

app.get('/api/admin/inverter_options', requireAuth, async (req, res) => {
    try {
        // Query the dedicated inverter_options table - select all columns to see what's available
        const query = 'SELECT * FROM inverter_options WHERE is_active = true ORDER BY kw';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching inverter options:', error);
        res.status(500).json({ error: 'Failed to fetch inverter options' });
    }
});

app.get('/api/admin/inverter_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM inverter_options WHERE id = $1 AND is_active = true';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inverter option not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching inverter option:', error);
        res.status(500).json({ error: 'Failed to fetch inverter option' });
    }
});

app.put('/api/admin/inverter_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, model, kw, price, efficiency, warranty_years, description } = req.body;
        
        const query = `
            UPDATE inverter_options 
            SET name = $1, brand = $2, model = $3, kw = $4, price = $5, efficiency = $6, warranty_years = $7, description = $8, updated_at = CURRENT_TIMESTAMP
            WHERE id = $9 AND is_active = true
            RETURNING *
        `;
        
        const values = [name, brand, model, kw, price, efficiency, warranty_years, description, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inverter option not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating inverter option:', error);
        res.status(500).json({ error: 'Failed to update inverter option' });
    }
});

app.post('/api/admin/inverter_options', requireAuth, async (req, res) => {
    try {
        const { name, brand, model, kw, price, efficiency, warranty_years, description } = req.body;
        
        const query = `
            INSERT INTO inverter_options (name, brand, model, kw, price, efficiency, warranty_years, description, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const values = [name, brand, model, kw, price, efficiency, warranty_years, description];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating inverter option:', error);
        res.status(500).json({ error: 'Failed to create inverter option' });
    }
});

app.delete('/api/admin/inverter_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'UPDATE inverter_options SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_active = true RETURNING *';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inverter option not found' });
        }
        
        res.json({ message: 'Inverter option deleted successfully' });
    } catch (error) {
        console.error('Error deleting inverter option:', error);
        res.status(500).json({ error: 'Failed to delete inverter option' });
    }
});

app.get('/api/admin/bank_configurations', requireAuth, async (req, res) => {
    try {
        console.log('Bank configurations request received from:', req.headers.origin);
        console.log('User authenticated:', req.user.email);
        
        // Query the dedicated bank_configurations table
        const query = 'SELECT id, bank_name, interest_rate, commission, loan_period, name, description, created_at, updated_at FROM bank_configurations WHERE is_active = true ORDER BY bank_name, interest_rate, loan_period';
        console.log('Executing query:', query);
        
        const result = await pool.query(query);
        console.log(`Found ${result.rows.length} bank configurations`);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bank configurations:', error);
        res.status(500).json({ error: 'Failed to fetch bank configurations' });
    }
});

app.get('/api/admin/bank_configurations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id, bank_name, interest_rate, commission, loan_period, name, description, created_at, updated_at FROM bank_configurations WHERE id = $1 AND is_active = true';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank configuration not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching bank configuration:', error);
        res.status(500).json({ error: 'Failed to fetch bank configuration' });
    }
});

app.put('/api/admin/bank_configurations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { bank_name, interest_rate, commission, loan_period, name, description } = req.body;
        
        // Convert percentage inputs back to decimal
        const cleanInterestRate = parseFloat(interest_rate) / 100;
        const cleanCommission = parseFloat(commission) / 100;
        
        const query = `
            UPDATE bank_configurations 
            SET bank_name = $1, interest_rate = $2, commission = $3, loan_period = $4, name = $5, description = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7 AND is_active = true
            RETURNING *
        `;
        
        const values = [bank_name, cleanInterestRate, cleanCommission, loan_period, name, description, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank configuration not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating bank configuration:', error);
        res.status(500).json({ error: 'Failed to update bank configuration' });
    }
});

app.post('/api/admin/bank_configurations', requireAuth, async (req, res) => {
    try {
        const { bank_name, interest_rate, commission, loan_period, name, description } = req.body;
        
        // Convert percentage inputs to decimal
        const cleanInterestRate = parseFloat(interest_rate) / 100;
        const cleanCommission = parseFloat(commission) / 100;
        
        const query = `
            INSERT INTO bank_configurations (bank_name, interest_rate, commission, loan_period, name, description, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const values = [bank_name, cleanInterestRate, cleanCommission, loan_period, name, description];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating bank configuration:', error);
        res.status(500).json({ error: 'Failed to create bank configuration' });
    }
});

app.delete('/api/admin/bank_configurations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'UPDATE bank_configurations SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_active = true RETURNING *';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bank configuration not found' });
        }
        
        res.json({ message: 'Bank configuration deleted successfully' });
    } catch (error) {
        console.error('Error deleting bank configuration:', error);
        res.status(500).json({ error: 'Failed to delete bank configuration' });
    }
});

app.get('/api/admin/system_cost_settings', requireAuth, async (req, res) => {
    try {
        // Use the same query structure as the working endpoint
        const query = `
            SELECT 
                id,
                setting_key,
                setting_value,
                description,
                updated_at
            FROM system_cost_settings 
            ORDER BY setting_key
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching system cost settings:', error);
        res.status(500).json({ error: 'Failed to fetch system cost settings' });
    }
});

app.get('/api/admin/system_cost_settings/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM system_cost_settings WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'System cost setting not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching system cost setting:', error);
        res.status(500).json({ error: 'Failed to fetch system cost setting' });
    }
});

// CRUD operations for panel options
app.post('/api/admin/panel_options', requireAuth, async (req, res) => {
    try {
        const { brand, model, wattage, price_per_watt, efficiency, cell_type, dimensions, weight_kg, warranty_years, description } = req.body;
        
        // Handle optional fields - use NULL for numeric fields, empty strings for text fields
        const cleanEfficiency = efficiency && efficiency !== '' ? parseFloat(efficiency) : null;
        const cleanCellType = cell_type || '';
        const cleanDimensions = dimensions || '';
        const cleanWeightKg = weight_kg && weight_kg !== '' ? parseFloat(weight_kg) : null;
        const cleanWarrantyYears = warranty_years && warranty_years !== '' ? parseInt(warranty_years) : null;
        const cleanDescription = description || '';
        
        // Create a name field from brand and model
        const name = `${brand} ${model}`.trim();
        
        const query = `
            INSERT INTO panel_options (name, brand, model, wattage, price, price_per_watt, efficiency, cell_type, dimensions, weight_kg, warranty_years, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;
        
        // Calculate total price from price per watt and wattage
        const totalPrice = parseFloat(price_per_watt) * parseFloat(wattage);
        
        const values = [name, brand, model, wattage, totalPrice, price_per_watt, cleanEfficiency, cleanCellType, cleanDimensions, cleanWeightKg, cleanWarrantyYears, cleanDescription];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating panel option:', error);
        res.status(500).json({ error: 'Failed to create panel option' });
    }
});

app.put('/api/admin/panel_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, wattage, price_per_watt, efficiency, cell_type, dimensions, weight_kg, warranty_years, description } = req.body;
        
        // Handle optional fields - use NULL for numeric fields, empty strings for text fields
        const cleanEfficiency = efficiency && efficiency !== '' ? parseFloat(efficiency) : null;
        const cleanCellType = cell_type || '';
        const cleanDimensions = dimensions || '';
        const cleanWeightKg = weight_kg && weight_kg !== '' ? parseFloat(weight_kg) : null;
        const cleanWarrantyYears = warranty_years && warranty_years !== '' ? parseInt(warranty_years) : null;
        const cleanDescription = description || '';
        
        // Create a name field from brand and model
        const name = `${brand} ${model}`.trim();
        
        const query = `
            UPDATE panel_options 
            SET name = $1, brand = $2, model = $3, wattage = $4, price = $5, price_per_watt = $6, efficiency = $7, 
                cell_type = $8, dimensions = $9, weight_kg = $10, warranty_years = $11, description = $12
            WHERE id = $13
            RETURNING *
        `;
        
        // Calculate total price from price per watt and wattage
        const totalPrice = parseFloat(price_per_watt) * parseFloat(wattage);
        
        const values = [name, brand, model, wattage, totalPrice, price_per_watt, cleanEfficiency, cleanCellType, cleanDimensions, cleanWeightKg, cleanWarrantyYears, cleanDescription, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Panel option not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating panel option:', error);
        res.status(500).json({ error: 'Failed to update panel option' });
    }
});

app.delete('/api/admin/panel_options/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'UPDATE panel_options SET is_active = false WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Panel option not found' });
        }
        
        res.json({ message: 'Panel option deleted successfully' });
    } catch (error) {
        console.error('Error deleting panel option:', error);
        res.status(500).json({ error: 'Failed to delete panel option' });
    }
});

// CRUD operations for system cost settings (inverters, bank configs, etc.)
app.post('/api/admin/system_cost_settings', requireAuth, async (req, res) => {
    try {
        const { setting_key, setting_value, description } = req.body;
        
        const query = `
            INSERT INTO system_cost_settings (setting_key, setting_value, description)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const values = [setting_key, setting_value, description];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating system cost setting:', error);
        res.status(500).json({ error: 'Failed to create system cost setting' });
    }
});

app.put('/api/admin/system_cost_settings/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { setting_key, setting_value, description } = req.body;
        
        const query = `
            UPDATE system_cost_settings 
            SET setting_key = $1, setting_value = $2, description = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        
        const values = [setting_key, setting_value, description, id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'System cost setting not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating system cost setting:', error);
        res.status(500).json({ error: 'Failed to update system cost setting' });
    }
});

app.delete('/api/admin/system_cost_settings/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM system_cost_settings WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'System cost setting not found' });
        }
        
        res.json({ message: 'System cost setting deleted successfully' });
    } catch (error) {
        console.error('Error deleting system cost setting:', error);
        res.status(500).json({ error: 'Failed to delete system cost setting' });
    }
});





// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Serve the main app for the price calculation route
app.get('/price_calculation', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve the test route protection page
app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/test-route-protection.html');
});

// Serve the authentication test page
app.get('/test-auth', (req, res) => {
    res.sendFile(__dirname + '/test-auth.html');
});

// Serve the admin flow test page
app.get('/test-admin-flow', (req, res) => {
    res.sendFile(__dirname + '/test-admin-flow.html');
});

// Serve the main app for the root route (redirect to login)
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve the admin management page (unprotected - frontend handles auth)
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin-management.html');
});

// Serve static files (CSS, JS, images) from root directory - AFTER ALL routes
app.use(express.static(__dirname, {
    index: false, // Don't serve index.html for directory requests
    extensions: ['html', 'css', 'js', 'ico', 'png', 'jpg', 'jpeg', 'gif', 'svg'], // Only serve specific file types
    setHeaders: (res, path) => {
        // Don't serve files for API routes
        if (path.startsWith('/api/')) {
            res.status(404).end();
        }
    }
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
