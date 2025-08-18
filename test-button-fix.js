// Test script to verify the calculate button fix
// Run this with: node test-button-fix.js

const BASE_URL = 'http://localhost:3001';

async function testButtonFix() {

    try {
        // Test 1: Check if server is running
        
        const health = await fetch(`${BASE_URL}/api/health`);
        if (health.ok) {
            
        } else {
            
            return;
        }
        
        // Test 2: Test if inverters endpoint returns data
        
        const inverters = await fetch(`${BASE_URL}/api/inverters`);
        if (inverters.ok) {
            const data = await inverters.json();
            if (data.success && data.data.inverters.length > 0) {

                // Test the data structure
                const firstInverter = data.data.inverters[0];
                if (firstInverter.kw && firstInverter.price && firstInverter.name) {

                } else {
                    
                }
            } else {
                
            }
        } else {
            
        }
        
        // Test 3: Test if the data can be mapped to frontend format
        
        const invertersData = await fetch(`${BASE_URL}/api/inverters`);
        if (invertersData.ok) {
            const data = await invertersData.json();
            if (data.success) {
                // Simulate the frontend mapping
                const frontendFormat = data.data.inverters.map(inv => ({
                    kw: inv.kw,
                    price: inv.price,
                    name: inv.name
                }));

                // Verify each inverter has required properties
                const validInverters = frontendFormat.filter(inv => inv.kw && inv.price && inv.name);
                if (validInverters.length === frontendFormat.length) {
                    
                } else {
                    
                }
            }
        }
        
        // Test 4: Test complete pricing endpoint
        
        const complete = await fetch(`${BASE_URL}/api/pricing-complete`);
        if (complete.ok) {
            const data = await complete.json();
            if (data.success) {

            } else {
                
            }
        } else {
            
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testButtonFix().then(() => {

});
