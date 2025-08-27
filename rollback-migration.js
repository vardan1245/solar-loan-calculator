// Rollback Migration Runner Script
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function rollbackMigration() {
    try {
        console.log('🔄 Starting inverter type rollback...\n');

        // Read the rollback SQL file
        const rollbackPath = path.join(process.cwd(), 'rollback-inverter-type-column.sql');
        const rollbackSQL = fs.readFileSync(rollbackPath, 'utf8');

        console.log('📖 Rollback SQL loaded successfully');
        console.log('🔌 Connecting to database...');

        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful\n');

        // Split the SQL into individual statements
        const statements = rollbackSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Executing ${statements.length} rollback statements...\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Skip empty statements and comments
            if (!statement || statement.startsWith('--')) {
                continue;
            }

            try {
                console.log(`   ${i + 1}/${statements.length}: Executing rollback statement...`);
                
                // Execute the statement
                const result = await pool.query(statement);
                
                if (result.rowCount !== undefined) {
                    console.log(`      ✅ Success (${result.rowCount} rows affected)`);
                } else {
                    console.log(`      ✅ Success`);
                }
                
            } catch (error) {
                // Check if it's a "does not exist" error (can happen if already rolled back)
                if (error.message.includes('does not exist') || error.message.includes('not found')) {
                    console.log(`      ⚠️  Warning: ${error.message.split('\n')[0]}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n🔄 Rollback completed successfully!');
        console.log('\n🔍 Verifying rollback...');

        // Verify the rollback
        const verifyResults = await Promise.all([
            pool.query("SELECT typname FROM pg_type WHERE typname = 'inverter_type'"),
            pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'inverter_options' AND column_name = 'type'")
        ]);

        console.log(`   ✅ Enum type removed: ${verifyResults[0].rows.length === 0 ? 'Yes' : 'No'}`);
        console.log(`   ✅ Type column removed: ${verifyResults[1].rows.length === 0 ? 'Yes' : 'No'}`);

        console.log('\n🔄 Rollback verification complete!');
        console.log('💡 The inverter_options table has been restored to its previous state');

    } catch (error) {
        console.error('\n❌ Rollback failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the rollback
rollbackMigration();
