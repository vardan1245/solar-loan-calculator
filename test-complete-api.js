// Comprehensive test script for the Tiamat Solar CRM Project API
// Run this with: node test-complete-api.js

const BASE_URL = 'http://localhost:3001';

async function testCompleteAPI() {
    console.log('🧪 Testing Tiamat Solar CRM Project Complete API\n');
    
    try {
        // Test 1: Get all system cost settings
        console.log('1️⃣ Testing GET /api/system-cost-settings');
        const costSettings = await fetch(`${BASE_URL}/api/system-cost-settings`);
        const costData = await costSettings.json();
        
        if (costData.success) {
            console.log('✅ Successfully retrieved system cost settings');
            console.log(`📊 Total records: ${costData.totalRecords}`);
            console.log(`📁 Categories: ${costData.categories.join(', ')}`);
            
            // Show sample data for each category
            Object.keys(costData.data).forEach(category => {
                const categoryData = costData.data[category];
                console.log(`\n📋 ${category.toUpperCase()}:`);
                console.log(`   Description: ${categoryData.description}`);
                console.log(`   Fields: ${Object.keys(categoryData.fields).join(', ')}`);
                
                const sampleKeys = Object.keys(categoryData.data).slice(0, 2);
                sampleKeys.forEach(key => {
                    const item = categoryData.data[key];
                    console.log(`   Sample: ${key} = ${item.value} (${item.description})`);
                });
            });
        } else {
            console.log('❌ Failed to retrieve cost settings:', costData.error);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Test 2: Get all inverter options
        console.log('2️⃣ Testing GET /api/inverters');
        const inverters = await fetch(`${BASE_URL}/api/inverters`);
        const inverterData = await inverters.json();
        
        if (inverterData.success) {
            console.log('✅ Successfully retrieved inverter options');
            console.log(`🔌 Total inverters: ${inverterData.totalInverters}`);
            console.log(`📊 Description: ${inverterData.data.description}`);
            console.log(`📋 Fields: ${Object.keys(inverterData.data.fields).join(', ')}`);
            
            // Show sample inverters
            const sampleInverters = inverterData.data.inverters.slice(0, 3);
            sampleInverters.forEach(inverter => {
                console.log(`   Sample: ${inverter.name} - ${inverter.kw} kW for ${inverter.price} AMD`);
            });
        } else {
            console.log('❌ Failed to retrieve inverters:', inverterData.error);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Test 3: Get all panel options
        console.log('3️⃣ Testing GET /api/panels');
        const panels = await fetch(`${BASE_URL}/api/panels`);
        const panelData = await panels.json();
        
        if (panelData.success) {
            console.log('✅ Successfully retrieved panel options');
            console.log(`☀️ Total panels: ${panelData.totalPanels}`);
            console.log(`📊 Description: ${panelData.data.description}`);
            console.log(`📋 Fields: ${Object.keys(panelData.data.fields).join(', ')}`);
            
            // Show sample panels
            const samplePanels = panelData.data.panels.slice(0, 3);
            samplePanels.forEach(panel => {
                console.log(`   Sample: ${panel.name} - ${panel.wattage}W at ${panel.price_per_watt} AMD/W`);
            });
        } else {
            console.log('❌ Failed to retrieve panels:', panelData.error);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Test 4: Get all bank configurations
        console.log('4️⃣ Testing GET /api/banks');
        const banks = await fetch(`${BASE_URL}/api/banks`);
        const bankData = await banks.json();
        
        if (bankData.success) {
            console.log('✅ Successfully retrieved bank configurations');
            console.log(`🏦 Total banks: ${bankData.totalBanks}`);
            console.log(`💳 Total options: ${bankData.totalOptions}`);
            console.log(`📊 Description: ${bankData.data.description}`);
            console.log(`📋 Fields: ${Object.keys(bankData.data.fields).join(', ')}`);
            
            // Show sample banks
            bankData.data.banks.forEach(bank => {
                console.log(`\n   🏦 ${bank.bank_name}:`);
                const sampleOptions = bank.options.slice(0, 2);
                sampleOptions.forEach(option => {
                    console.log(`     ${option.name} - ${(option.interest_rate * 100).toFixed(1)}% interest, ${(option.commission * 100).toFixed(1)}% commission, ${option.loan_period}m`);
                });
            });
        } else {
            console.log('❌ Failed to retrieve banks:', bankData.error);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Test 5: Get complete pricing data
        console.log('5️⃣ Testing GET /api/pricing-complete');
        const complete = await fetch(`${BASE_URL}/api/pricing-complete`);
        const completeData = await complete.json();
        
        if (completeData.success) {
            console.log('✅ Successfully retrieved complete pricing data');
            console.log(`📊 Summary:`);
            console.log(`   Cost Settings: ${completeData.summary.totalCostSettings}`);
            console.log(`   Inverters: ${completeData.summary.totalInverters}`);
            console.log(`   Panels: ${completeData.summary.totalPanels}`);
            console.log(`   Bank Options: ${completeData.summary.totalBankOptions}`);
            
            // Show installation costs
            console.log(`\n💰 Installation Costs per kW:`);
            Object.entries(completeData.data.systemCosts.installationCosts).forEach(([type, cost]) => {
                console.log(`   ${type}: ${cost.toLocaleString()} AMD`);
            });
            
            // Show sample inverters
            console.log(`\n🔌 Sample Inverters:`);
            const sampleInverters = completeData.data.inverters.slice(0, 3);
            sampleInverters.forEach(inverter => {
                console.log(`   ${inverter.name}: ${inverter.kw} kW for ${inverter.price.toLocaleString()} AMD`);
            });
            
            // Show sample panels
            console.log(`\n☀️ Sample Panels:`);
            const samplePanels = completeData.data.panels.slice(0, 3);
            samplePanels.forEach(panel => {
                console.log(`   ${panel.name}: ${panel.wattage}W at ${panel.price_per_watt} AMD/W`);
            });
            
        } else {
            console.log('❌ Failed to retrieve complete pricing:', completeData.error);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Test 6: Health check
        console.log('6️⃣ Testing GET /api/health');
        const health = await fetch(`${BASE_URL}/api/health`);
        const healthData = await health.json();
        
        if (healthData.status === 'OK') {
            console.log('✅ Health check passed');
            console.log(`🕒 Timestamp: ${healthData.timestamp}`);
        } else {
            console.log('❌ Health check failed:', healthData);
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testCompleteAPI().then(() => {
    console.log('\n🏁 Complete API testing finished!');
    console.log('\n💡 API Endpoints Summary:');
    console.log('   GET /api/system-cost-settings - All cost settings organized by category');
    console.log('   GET /api/inverters - All inverter options');
    console.log('   GET /api/panels - All photovoltaic panel options');
    console.log('   GET /api/banks - All bank loan configurations');
    console.log('   GET /api/pricing-complete - Complete pricing data from all tables');
    console.log('   PUT /api/system-cost-settings/:id - Update a cost setting');
    console.log('   GET /api/health - Health check');
    
    console.log('\n📊 Database Tables Created:');
    console.log('   ✅ system_cost_settings - Your existing table (fixed ground system cost)');
    console.log('   ✅ inverter_options - New table with 16 inverter options');
    console.log('   ✅ panel_options - New table with 8 panel options');
    console.log('   ✅ bank_configurations - New table with 19 bank options');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start your server: node server.js');
    console.log('   2. Test the API: node test-complete-api.js');
    console.log('   3. Use the endpoints in your frontend application');
});
