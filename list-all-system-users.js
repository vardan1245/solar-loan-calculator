import pg from 'pg';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const { Pool } = pg;

// Database connection for admin_users table
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Supabase client for auth users
const supabaseUrl = 'https://ylmcwkabyqvgdrbnunri.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllSystemUsers() {
    const client = await pool.connect();
    
    try {
        console.log('👥 TIAMAT SOLAR CRM - USER LISTING\n');
        console.log('═'.repeat(80));
        
        // 1. Check admin_users table
        console.log('\n📋 ADMIN_USERS TABLE (Local Database):\n');
        const adminUsersResult = await client.query(`
            SELECT username, full_name, email, role, is_active, created_at, last_login
            FROM admin_users 
            ORDER BY 
                CASE role 
                    WHEN 'admin' THEN 1 
                    WHEN 'sales_office' THEN 2 
                    WHEN 'user' THEN 3 
                END,
                username
        `);
        
        if (adminUsersResult.rows.length === 0) {
            console.log('   No users found in admin_users table.\n');
        } else {
            adminUsersResult.rows.forEach((user, index) => {
                const statusIcon = user.is_active ? '✅' : '❌';
                const lastLogin = user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never';
                
                console.log(`${index + 1}. ${statusIcon} ${user.role.toUpperCase().padEnd(12)} | ${user.username}`);
                console.log(`   Name: ${user.full_name || 'Not set'}`);
                console.log(`   Email: ${user.email || 'Not set'}`);
                console.log(`   Last Login: ${lastLogin}`);
                console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
                console.log('');
            });
            
            // Count by role
            const roleCounts = {};
            adminUsersResult.rows.forEach(user => {
                roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
            });
            
            console.log('   Summary:');
            Object.entries(roleCounts).forEach(([role, count]) => {
                console.log(`   • ${role}: ${count} user(s)`);
            });
        }
        
        console.log('\n' + '─'.repeat(80));
        
        // 2. Check Supabase Auth users
        console.log('\n📋 SUPABASE AUTH USERS (Authentication System):\n');
        const { data: authData, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
            console.log('   Error fetching Supabase auth users:', error.message);
        } else {
            const authUsers = authData?.users || [];
            
            if (authUsers.length === 0) {
                console.log('   No users found in Supabase Auth.\n');
            } else {
                // Group by role
                const adminAuthUsers = authUsers.filter(u => 
                    u.app_metadata?.role === 'admin' || u.user_metadata?.role === 'admin'
                );
                const salesOfficeAuthUsers = authUsers.filter(u => 
                    u.app_metadata?.role === 'sales_office' || u.user_metadata?.role === 'sales_office'
                );
                const regularUsers = authUsers.filter(u => {
                    const role = u.app_metadata?.role || u.user_metadata?.role;
                    return !role || role === 'user';
                });
                
                // Display Admins
                if (adminAuthUsers.length > 0) {
                    console.log('   🔑 ADMINS:');
                    adminAuthUsers.forEach((user, index) => {
                        const confirmed = user.email_confirmed_at ? '✅' : '⏳';
                        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';
                        const name = user.user_metadata?.name || user.user_metadata?.full_name || 'Not set';
                        
                        console.log(`   ${index + 1}. ${confirmed} ${user.email}`);
                        console.log(`      Name: ${name}`);
                        console.log(`      Last Sign In: ${lastSignIn}`);
                        console.log(`      Created: ${new Date(user.created_at).toLocaleDateString()}`);
                        console.log('');
                    });
                }
                
                // Display Sales Office
                if (salesOfficeAuthUsers.length > 0) {
                    console.log('   💼 SALES OFFICE:');
                    salesOfficeAuthUsers.forEach((user, index) => {
                        const confirmed = user.email_confirmed_at ? '✅' : '⏳';
                        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';
                        const name = user.user_metadata?.name || user.user_metadata?.full_name || 'Not set';
                        
                        console.log(`   ${index + 1}. ${confirmed} ${user.email}`);
                        console.log(`      Name: ${name}`);
                        console.log(`      Last Sign In: ${lastSignIn}`);
                        console.log(`      Created: ${new Date(user.created_at).toLocaleDateString()}`);
                        console.log('');
                    });
                }
                
                // Display Regular Users
                if (regularUsers.length > 0) {
                    console.log('   👤 REGULAR USERS:');
                    regularUsers.forEach((user, index) => {
                        const confirmed = user.email_confirmed_at ? '✅' : '⏳';
                        const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';
                        const name = user.user_metadata?.name || user.user_metadata?.full_name || 'Not set';
                        
                        console.log(`   ${index + 1}. ${confirmed} ${user.email}`);
                        console.log(`      Name: ${name}`);
                        console.log(`      Last Sign In: ${lastSignIn}`);
                        console.log('');
                    });
                }
                
                console.log('   Summary:');
                console.log(`   • Total: ${authUsers.length} user(s)`);
                console.log(`   • Admins: ${adminAuthUsers.length}`);
                console.log(`   • Sales Office: ${salesOfficeAuthUsers.length}`);
                console.log(`   • Regular Users: ${regularUsers.length}`);
                console.log(`   • Confirmed: ${authUsers.filter(u => u.email_confirmed_at).length}`);
                console.log(`   • Pending: ${authUsers.filter(u => !u.email_confirmed_at).length}`);
            }
        }
        
        console.log('\n' + '═'.repeat(80));
        console.log('\n✨ User listing complete!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nError details:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the function
listAllSystemUsers();
