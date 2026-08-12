#!/bin/bash
# vps-db-setup.sh
# PostgreSQL setup script for PentaPeaks

set -e

# Prompt for database password
echo "Enter a strong password for the 'pentapeaks_user' database role:"
read -s DB_PASSWORD

# Switch to postgres user and execute setup commands
echo "Creating database and user..."
sudo -u postgres psql <<EOF
-- Create the database
CREATE DATABASE pentapeaks;

-- Create the user
CREATE USER pentapeaks_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pentapeaks TO pentapeaks_user;

-- Connect to the database and grant schema privileges
\c pentapeaks
GRANT ALL ON SCHEMA public TO pentapeaks_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO pentapeaks_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO pentapeaks_user;
EOF

echo "=========================================="
echo "Database setup complete!"
echo ""
echo "Your DATABASE_URL connection string is:"
echo "postgresql://pentapeaks_user:$DB_PASSWORD@localhost:5432/pentapeaks"
echo ""
echo "Save this URL for your .env.production file."
echo "=========================================="
