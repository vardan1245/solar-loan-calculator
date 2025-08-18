// Simple script to help start the server
// Run this with: node start-server.js

const { spawn } = require('child_process');
const path = require('path');

// Check if server.js exists
const fs = require('fs');
const serverPath = path.join(__dirname, 'server.js');

if (!fs.existsSync(serverPath)) {
    console.error('❌ server.js not found in current directory');
    console.log('   Make sure you are in the project root directory');
    process.exit(1);
}

console.log('✅ server.js found');
console.log('📁 Current directory:', __dirname);
console.log('🔧 Starting server on port 3001...\n');

// Start the server
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true
});

server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure you have Node.js installed');
    console.log('   2. Check if port 3001 is already in use');
    console.log('   3. Verify all dependencies are installed (npm install)');
});

server.on('close', (code) => {
    if (code !== 0) {
        console.log(`\n⚠️ Server process exited with code ${code}`);
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGTERM');
    process.exit(0);
});

console.log('💡 Server is starting...');
console.log('   Press Ctrl+C to stop the server');
console.log('   Check http://localhost:3001/api/health to verify it\'s running\n');
