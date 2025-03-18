#!/bin/bash
set -e

# Print commands being executed
set -x

# Install necessary packages
echo "Installing @tailwindcss/postcss..."
npm install --save @tailwindcss/postcss

# Run the PostCSS config check
echo "Verifying PostCSS configuration..."
node scripts/ensure-postcss-config.js

# Clean the .next directory
echo "Cleaning .next directory..."
rm -rf .next

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Handle database setup
echo "Handling database setup..."
node scripts/handle-db-build.js

# Build the Next.js app
echo "Building Next.js app..."
npx next build 