const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://ylmcwkabyqvgdrbnunri.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Database functions
async function getSystemCostSettings() {
    try {
        const { data, error } = await supabase.rpc('get_system_cost_settings');
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting system cost settings:', error);
        throw error;
    }
}

async function updateSystemCostSetting(settingKey, settingValue) {
    try {
        const { data, error } = await supabase
            .from('system_cost_settings')
            .upsert({ 
                setting_key: settingKey, 
                setting_value: settingValue 
            }, { 
                onConflict: 'setting_key' 
            });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating system cost setting:', error);
        throw error;
    }
}

// API Routes
app.get('/api/system-settings', async (req, res) => {
    try {
        const settings = await getSystemCostSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/update-setting', async (req, res) => {
    try {
        const { settingKey, settingValue } = req.body;
        const result = await updateSystemCostSetting(settingKey, settingValue);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the calculator`);
}); 