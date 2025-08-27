// Migration Runner Script
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

async function runMigration() {
    try {
        console.log('🚀 Starting inverter type migration...\n');

        // Read the migration SQL file
        const migrationPath = path.join(process.cwd(), 'add-inverter-type-column.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📖 Migration SQL loaded successfully');
        console.log('🔌 Connecting to database...');

        // Test connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful\n');

        // Split the SQL into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Executing ${statements.length} SQL statements...\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Skip empty statements and comments
            if (!statement || statement.startsWith('--')) {
                continue;
            }

            try {
                console.log(`   ${i + 1}/${statements.length}: Executing statement...`);
                
                // Execute the statement
                const result = await pool.query(statement);
                
                if (result.rowCount !== undefined) {
                    console.log(`      ✅ Success (${result.rowCount} rows affected)`);
                } else {
                    console.log(`      ✅ Success`);
                }
                
            } catch (error) {
                // Check if it's a "type already exists" error (can happen if running twice)
                if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
                    console.log(`      ⚠️  Warning: ${error.message.split('\n')[0]}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n🎉 Migration completed successfully!');
        console.log('\n🔍 Verifying changes...');

        // Verify the changes
        const verifyResults = await Promise.all([
            pool.query("SELECT typname FROM pg_type WHERE typname = 'inverter_type'"),
            pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'inverter_options' AND column_name = 'type'"),
            pool.query("SELECT COUNT(*) as total, COUNT(type) as with_type FROM inverter_options")
        ]);

        console.log(`   ✅ Enum type exists: ${verifyResults[0].rows.length > 0 ? 'Yes' : 'No'}`);
        console.log(`   ✅ Type column exists: ${verifyResults[1].rows.length > 0 ? 'Yes' : 'No'}`);
        console.log(`   📊 Records: ${verifyResults[2].rows[0].total} total, ${verifyResults[2].rows[0].with_type} with type`);

        console.log('\n🚀 Migration verification complete!');
        console.log('💡 You can now run: node test-inverter-type.js');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('\n🔧 To rollback, run: node rollback-migration.js');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the migration
runMigration();
