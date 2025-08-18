// Test script to verify the connection fixes
// Run this with: node test-connection-fix.js

const BASE_URL = 'http://localhost:3001';

async function testConnectionFix() {

    try {
        // Test 1: Check if server is running and accessible
        
        const health = await fetch(`${BASE_URL}/api/health`);
        if (health.ok) {
            const data = await health.json();

        } else {
            
            return;
        }
        
        // Test 2: Test CORS headers
        
        const corsTest = await fetch(`${BASE_URL}/api/health`, {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:3000'
            }
        });
        
        if (corsTest.ok) {

        } else {
            
        }
        
        // Test 3: Test inverters endpoint
        
        const inverters = await fetch(`${BASE_URL}/api/inverters`);
        if (inverters.ok) {
            const data = await inverters.json();
            if (data.success && data.data.inverters.length > 0) {
                
            } else {
                
            }
        } else {
            
        }
        
        // Test 4: Test system cost settings endpoint
        
        const costs = await fetch(`${BASE_URL}/api/system-cost-settings`);
        if (costs.ok) {
            const data = await costs.json();

        } else {
            
        }
        
        // Test 5: Test banks endpoint
        
        const banks = await fetch(`${BASE_URL}/api/banks`);
        if (banks.ok) {
            const data = await banks.json();
            if (data.success && data.data.banks.length > 0) {
                
            } else {
                
            }
        } else {
            
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testConnectionFix().then(() => {

});
