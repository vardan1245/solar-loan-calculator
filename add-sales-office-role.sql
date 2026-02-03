-- Migration: Add 'sales_office' role to the system
-- Date: 2026-02-02
-- Description: Adds a new 'sales_office' role for sales office users

-- Step 1: Drop the existing CHECK constraint if it exists
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Step 2: Add new CHECK constraint with 'sales_office' role included
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('admin', 'sales_office', 'user'));

-- Step 3: Create an index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Step 4: Insert a sample sales office user (optional - remove if not needed)
-- Password: sales123 (change this in production!)
INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active) 
VALUES ('salesoffice', 'sales123', 'Sales Office', 'salesoffice@tiamat.com', 'sales_office', true)
ON CONFLICT (username) DO NOTHING;

-- Summary of roles
-- • admin: Full administrative access
-- • sales_office: Sales office staff access
-- • user: Regular user access

COMMENT ON COLUMN admin_users.role IS 'User role: admin (full access), sales_office (sales office staff), or user (regular user)';
