#!/bin/bash

# Deploy to Vercel with enhanced error logging

echo "Deploying to Vercel with enhanced error logging..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to production
echo "Deploying to production..."
vercel --prod

echo "Deployment completed."
echo "Check Vercel logs for detailed error information."
echo "You can view logs with: vercel logs synthalyst-web.vercel.app" 