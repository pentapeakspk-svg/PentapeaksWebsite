#!/bin/bash
# deploy-vps.sh
# Deployment script to be run on the Hostinger VPS
# Usage: ./deploy-vps.sh

set -e

# Configuration
APP_DIR="/var/www/pentapeaks"
PM2_APP_NAME="pentapeaks"

echo "=========================================="
echo "Starting PentaPeaks Deployment on VPS"
echo "=========================================="

cd $APP_DIR

echo "1. Pulling latest code..."
git pull origin main

echo "2. Installing dependencies..."
npm ci

echo "3. Generating Prisma client..."
npx prisma generate

echo "4. Pushing database schema (Migration)..."
npx prisma db push

echo "5. Building Next.js application..."
npm run build

echo "5.5 Copying static assets and env file to standalone folder..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/.env.production || true

echo "6. Restarting application via PM2..."
pm2 reload $PM2_APP_NAME

echo "=========================================="
echo "Deployment Complete! 🚀"
echo "Check logs with: pm2 logs $PM2_APP_NAME"
echo "=========================================="
