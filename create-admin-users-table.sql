-- Create admin users table for secure authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'sales_office', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- In production, use a proper password hashing tool
INSERT INTO admin_users (username, password_hash, full_name, email, role) 
VALUES ('admin', 'admin123', 'System Administrator', 'admin@tiamat.com', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Create index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Grant permissions (adjust based on your database setup)
GRANT SELECT, INSERT, UPDATE ON admin_users TO postgres;
GRANT USAGE, SELECT ON SEQUENCE admin_users_id_seq TO postgres;
