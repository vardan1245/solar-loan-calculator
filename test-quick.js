// Quick test script to verify the new API endpoints
// Run this with: node test-quick.js

const BASE_URL = 'http://localhost:3001';

async function quickTest() {

    try {
        // Test 1: Check if server is running
        
        const health = await fetch(`${BASE_URL}/api/health`);
        if (health.ok) {
            
        } else {
            
            return;
        }
        
        // Test 2: Check inverters endpoint
        
        const inverters = await fetch(`${BASE_URL}/api/inverters`);
        if (inverters.ok) {
            const data = await inverters.json();
            if (data.success) {

            } else {
                
            }
        } else {
            
        }
        
        // Test 3: Check system cost settings
        
        const costs = await fetch(`${BASE_URL}/api/system-cost-settings`);
        if (costs.ok) {
            const data = await costs.json();
            if (data.success) {

            } else {
                
            }
        } else {
            
        }
        
        // Test 4: Check complete pricing
        
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

quickTest().then(() => {

});
