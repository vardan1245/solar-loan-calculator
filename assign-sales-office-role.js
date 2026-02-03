import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://ylmcwkabyqvgdrbnunri.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function assignSalesOfficeRole(emails) {
    try {
        console.log('🚀 Assigning Sales Office Role...\n');
        console.log('═'.repeat(60));
        
        for (const email of emails) {
            console.log(`\n📧 Processing: ${email}`);
            
            // Get all users and find by email
            const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
            
            if (listError) {
                console.error(`❌ Error listing users: ${listError.message}`);
                continue;
            }
            
            const user = allUsers.users.find(u => u.email === email);
            
            if (!user) {
                console.log(`❌ User not found: ${email}`);
                continue;
            }
            
            console.log(`✓ User found: ${user.id}`);
            
            // Update user metadata with sales_office role
            const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                {
                    app_metadata: {
                        role: 'sales_office'
                    }
                }
            );
            
            if (updateError) {
                console.log(`❌ Failed to update: ${updateError.message}`);
            } else {
                console.log(`✅ Successfully assigned sales_office role`);
                
                // Verify the update
                const currentRole = updateData.user.app_metadata?.role || 'user';
                console.log(`   Current role: ${currentRole}`);
            }
        }
        
        console.log('\n' + '═'.repeat(60));
        console.log('\n🔍 Verifying role assignments...\n');
        
        // List all users with their roles
        const { data: verifyData, error: verifyError } = await supabase.auth.admin.listUsers();
        
        if (!verifyError) {
            const salesOfficeUsers = verifyData.users.filter(u => 
                u.app_metadata?.role === 'sales_office'
            );
            
            console.log(`📊 Total Sales Office users: ${salesOfficeUsers.length}\n`);
            
            salesOfficeUsers.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   Name: ${user.user_metadata?.name || user.user_metadata?.full_name || 'Not set'}`);
                console.log(`   User ID: ${user.id}`);
                console.log('');
            });
        }
        
        console.log('✨ Role assignment complete!\n');
        
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        console.error('\nError details:', error);
    }
}

// Users to assign sales_office role
const usersToUpdate = [
    'aram.mkoyan@icloud.com',
    'edoavagyan0001@gmail.com'
];

assignSalesOfficeRole(usersToUpdate);
