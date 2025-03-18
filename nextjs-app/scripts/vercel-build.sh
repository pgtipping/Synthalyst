#!/bin/bash
set -e

# Print commands being executed
set -x

# Install necessary packages
echo "Installing required packages..."
npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
npm install --save @tailwindcss/postcss

# Run the PostCSS config check
echo "Verifying PostCSS configuration..."
node scripts/ensure-postcss-config.js

# Run the Babel config debug script
echo "Debugging Babel configuration..."
node scripts/debug-babel.js

# Temporarily move babel config files to allow Next.js to use its default compiler
echo "Temporarily moving Babel configuration files..."
if [ -f ".babelrc" ]; then
  mv .babelrc .babelrc.backup
fi
if [ -f "babel.config.js" ]; then
  mv babel.config.js babel.config.js.backup
fi

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
echo "Building Next.js app with default compiler..."
npx next build

# Restore babel config files
echo "Restoring Babel configuration files..."
if [ -f ".babelrc.backup" ]; then
  mv .babelrc.backup .babelrc
fi
if [ -f "babel.config.js.backup" ]; then
  mv babel.config.js.backup babel.config.js
fi 