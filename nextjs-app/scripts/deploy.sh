#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm ci

# Step 2: Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Step 3: Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Step 4: Build the application
echo "Building the application..."
npm run build

echo "Deployment preparation complete!"
echo "You can now deploy to production with 'vercel --prod'" 