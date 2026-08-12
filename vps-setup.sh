#!/bin/bash
# vps-setup.sh
# Complete server provisioning script for PentaPeaks on Hostinger VPS (Ubuntu)
# Run as root or with sudo

set -e

echo "=========================================="
echo "PentaPeaks VPS Setup Script"
echo "=========================================="

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install dependencies
echo "Installing prerequisites..."
apt install -y curl wget gnupg2 ca-certificates lsb-release apt-transport-https build-essential git software-properties-common ufw unzip

# Install Node.js 20 LTS
echo "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node.js
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node.js $node_version and npm $npm_version installed."

# Install PostgreSQL 16
echo "Installing PostgreSQL..."
sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update
apt install -y postgresql-16 postgresql-contrib-16

# Ensure PostgreSQL starts on boot
systemctl enable postgresql
systemctl start postgresql

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# Install PM2 globally
echo "Installing PM2 process manager..."
npm install -g pm2
pm2 startup ubuntu -u root --hp /root

# Install Certbot for SSL
echo "Installing Certbot (Let's Encrypt)..."
apt install -y certbot python3-certbot-nginx

# Setup UFW Firewall
echo "Configuring UFW Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
# ufw --force enable # Commented out so it doesn't lock you out immediately without checking

# Create web directory
echo "Setting up web directory..."
mkdir -p /var/www/pentapeaks
# We will use root for deployment simplicity here, or you can create a specific user
chown -R $USER:$USER /var/www/pentapeaks

echo "=========================================="
echo "VPS Setup Complete!"
echo "Next Steps:"
echo "1. Run ./vps-db-setup.sh to configure the database"
echo "2. Clone your repository into /var/www/pentapeaks"
echo "3. Configure Nginx and SSL"
echo "=========================================="
