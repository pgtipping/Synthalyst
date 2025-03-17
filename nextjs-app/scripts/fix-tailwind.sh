#!/bin/bash

# Exit on error
set -e

echo "Fixing Tailwind CSS configuration..."

# Install Tailwind CSS and its dependencies
npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer

# Remove the TypeScript PostCSS config if it exists
if [ -f "postcss.config.ts" ]; then
  echo "Removing postcss.config.ts..."
  rm postcss.config.ts
fi

# Ensure the CJS PostCSS config includes autoprefixer
echo "Updating postcss.config.cjs..."
cat > postcss.config.cjs << EOL
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

module.exports = config;
EOL

echo "Tailwind CSS configuration fixed!" 