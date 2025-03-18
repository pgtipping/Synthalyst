#!/bin/bash
set -e

# Print commands being executed
set -x

# Install necessary packages with explicit versions and ensure they're saved to dependencies
echo "Installing required packages..."
npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0
npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2
npm install --save @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3

# Verify essential dependencies
echo "Verifying essential dependencies..."
if ! npm list clsx >/dev/null 2>&1; then
  echo "clsx not found, installing..."
  npm install --save clsx@2.1.1
fi

if ! npm list tailwind-merge >/dev/null 2>&1; then
  echo "tailwind-merge not found, installing..."
  npm install --save tailwind-merge@3.0.2
fi

if ! npm list @radix-ui/react-tabs >/dev/null 2>&1; then
  echo "@radix-ui/react-tabs not found, installing..."
  npm install --save @radix-ui/react-tabs@1.1.3
fi

if ! npm list @tailwindcss/postcss >/dev/null 2>&1; then
  echo "@tailwindcss/postcss not found, installing..."
  npm install --save @tailwindcss/postcss@4.0.14
fi

# Run the PostCSS config check
echo "Verifying PostCSS configuration..."
node scripts/ensure-postcss-config.js

# Run the UI Components preparation
echo "Preparing UI components..."
node scripts/prepare-ui-components.js

# Verify UI components
echo "Verifying UI components..."
node scripts/verify-ui-components.js

# Copy components to ensure they're available to the build
echo "Copying UI components..."
node scripts/copy-ui-components-to-build.js

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