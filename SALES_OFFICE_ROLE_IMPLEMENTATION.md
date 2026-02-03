# Sales Office Role Implementation

## Overview
A new user role called **"sales_office"** has been added to the Tiamat Solar CRM system for sales office staff users.

## Role Hierarchy

| Role | Level | Description | Access Level |
|------|-------|-------------|--------------|
| **admin** | 3 | System Administrator | Full access to all features |
| **sales_office** | 2 | Sales Office Staff | Calculator and sales features |
| **user** | 1 | Regular User | Basic access |

## Changes Made

### 1. Database Schema Update
**File**: `create-admin-users-table.sql`
- Added CHECK constraint to validate roles: `'admin'`, `'sales_office'`, `'user'`
- Role column now enforces valid role values

### 2. Migration Files
**Files Created**:
- `add-sales-office-role.sql` - SQL migration script
- `run-sales-office-role-migration.js` - Migration runner script

**Migration includes**:
- Drops old CHECK constraint
- Adds new CHECK constraint with 'sales_office' role
- Creates index on role column for performance
- Adds sample sales office user (username: `salesoffice`, password: `sales123`)

### 3. Role Validation
The database now validates that roles can only be:
- `'admin'`
- `'sales_office'`
- `'user'`

Any attempt to set a different role will be rejected by the database.

## Running the Migration

### Option 1: Using Node.js Script
```bash
node run-sales-office-role-migration.js
```

### Option 2: Manual SQL Execution
Connect to your database and run:
```bash
psql $DATABASE_URL < add-sales-office-role.sql
```

### Option 3: Via Supabase Dashboard
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy contents of `add-sales-office-role.sql`
4. Execute the SQL

## Creating Sales Office Users

### Method 1: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Create new user
3. Set `app_metadata` or `user_metadata`:
   ```json
   {
     "role": "sales_office"
   }
   ```

### Method 2: Via SQL (for admin_users table)
```sql
INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active) 
VALUES ('username', 'hashed_password', 'Full Name', 'email@example.com', 'sales_office', true);
```

### Method 3: Update Existing User
```sql
UPDATE admin_users 
SET role = 'sales_office' 
WHERE username = 'existing_username';
```

## Sample Sales Office User
After running the migration, a sample sales office user is created:
- **Username**: `salesoffice`
- **Password**: `sales123` (⚠️ **Change in production!**)
- **Email**: `salesoffice@tiamat.com`
- **Role**: `sales_office`

## Verifying the Migration

### Check Role Distribution
```sql
SELECT role, COUNT(*) as count 
FROM admin_users 
GROUP BY role 
ORDER BY role;
```

### List All Sales Office Users
```sql
SELECT id, username, full_name, email, role, is_active
FROM admin_users 
WHERE role = 'sales_office';
```

## Role-Based Access Control (Future Implementation)

The role system is now ready for implementing role-based access control:

### Planned Features by Role:

#### Admin (`'admin'`)
- ✅ Full calculator access
- ✅ User management
- ✅ Settings configuration
- ✅ Database management
- ✅ All advanced features

#### Sales Office (`'sales_office'`)
- ✅ Full calculator access
- ✅ Generate quotes/offers
- ✅ View/export results
- ✅ Sales-specific features
- ❌ No user management
- ❌ No settings configuration
- ❌ Limited admin features

#### User (`'user'`)
- ✅ Basic calculator access
- ✅ View results
- ❌ No quote generation
- ❌ No export features
- ❌ No admin features

## Code Examples

### Checking User Role
```javascript
// In frontend (index.html)
const currentUser = await supabase.auth.getUser();
const userRole = currentUser.data.user?.app_metadata?.role || 
                 currentUser.data.user?.user_metadata?.role || 
                 'user';

if (userRole === 'sales_office') {
    // Show sales office-specific features
    console.log('Sales office user detected');
}
```

### Role-Based Feature Toggle
```javascript
function canAccessFeature(feature) {
    const role = getUserRole();
    
    const permissions = {
        'admin': ['all'],
        'sales_office': ['calculator', 'quotes', 'export', 'sales_reports'],
        'user': ['calculator', 'view']
    };
    
    return permissions[role]?.includes(feature) || 
           permissions[role]?.includes('all');
}
```

### Display Role Name
```javascript
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrator',
        'sales_office': 'Sales Office',
        'user': 'User'
    };
    return roleNames[role] || 'Unknown';
}
```

## Security Notes

1. **Default Password**: Change the default sales office user password immediately
2. **Role Validation**: Database enforces valid roles via CHECK constraint
3. **Index Created**: Role column is indexed for performance
4. **Future-Ready**: System ready for role-based access control implementation

## Rollback (If Needed)

To remove the sales_office role:
```sql
-- Update all sales_office users to user role
UPDATE admin_users SET role = 'user' WHERE role = 'sales_office';

-- Drop the constraint
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Add back old constraint
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('admin', 'user'));
```

## Next Steps

1. ✅ Run the migration script
2. ✅ Verify roles are working
3. ⏳ Implement role-based UI features
4. ⏳ Add role-based API restrictions
5. ⏳ Create role management interface

---

**Date**: February 2, 2026  
**Status**: ✅ Implemented - Ready for Testing  
**Files Modified**: 3 files (create-admin-users-table.sql, add-sales-office-role.sql, run-sales-office-role-migration.js)  
**New Role**: `sales_office` - Sales office staff access level
