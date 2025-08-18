import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client with service role key (admin access)
const supabaseUrl = 'https://ylmcwkabyqvgdrbnunri.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to .env

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
    console.log('📝 To get this key:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Settings → API');
    console.log('3. Copy the "service_role" key (not the anon key)');
    console.log('4. Add it to your .env file as: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllUsers() {
    try {
        console.log('🔍 Fetching all users from Supabase...\n');
        
        // Get all users (this requires service role key)
        const { data: users, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
            console.error('❌ Error fetching users:', error);
            return;
        }
        
        // Extract the actual users array from the nested response
        const actualUsers = users?.users || [];
        
        if (!actualUsers || !Array.isArray(actualUsers)) {
            console.log('📝 No users found or unexpected response format.');
            console.log('Response type:', typeof actualUsers);
            console.log('Response:', actualUsers);
            return;
        }
        
        if (actualUsers.length === 0) {
            console.log('📝 No users found in the system.');
            return;
        }
        
        console.log(`✅ Found ${actualUsers.length} user(s):\n`);
        console.log('─'.repeat(80));
        console.log('│ Email'.padEnd(35) + '│ ID'.padEnd(28) + '│ Role'.padEnd(8) + '│ Status'.padEnd(8) + '│');
        console.log('─'.repeat(80));
        
        actualUsers.forEach((user, index) => {
            const email = user.email || 'No email';
            const id = user.id || 'No ID';
            const role = user.app_metadata?.role || user.user_metadata?.role || 'user';
            const status = user.email_confirmed_at ? '✅ Confirmed' : '⏳ Pending';
            const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';
            
            console.log(`│ ${email.padEnd(33)} │ ${id.padEnd(26)} │ ${role.padEnd(6)} │ ${status.padEnd(6)} │`);
            
            // Show additional details for each user
            if (user.user_metadata) {
                console.log(`│   └─ Full Name: ${user.user_metadata.name || user.user_metadata.full_name || 'Not set'}`);
                console.log(`│   └─ Last Sign In: ${lastSignIn}`);
                console.log(`│   └─ Created: ${new Date(user.created_at).toLocaleDateString()}`);
            }
            
            if (index < actualUsers.length - 1) {
                console.log('│' + ' '.repeat(78) + '│');
            }
        });
        
        console.log('─'.repeat(80));
        
        // Summary
        const confirmedUsers = actualUsers.filter(u => u.email_confirmed_at).length;
        const pendingUsers = actualUsers.filter(u => !u.email_confirmed_at).length;
        const adminUsers = actualUsers.filter(u => u.app_metadata?.role === 'admin' || u.user_metadata?.role === 'admin').length;
        
        console.log(`\n📊 Summary:`);
        console.log(`   • Total Users: ${actualUsers.length}`);
        console.log(`   • Confirmed: ${confirmedUsers}`);
        console.log(`   • Pending Confirmation: ${pendingUsers}`);
        console.log(`   • Admins: ${adminUsers}`);
        console.log(`   • Regular Users: ${actualUsers.length - adminUsers}`);
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
    }
}

// Run the function
listAllUsers();
