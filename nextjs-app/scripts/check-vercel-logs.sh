#!/bin/bash

# Check Vercel logs for the production environment

echo "Checking Vercel logs for the production environment..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
vercel whoami || vercel login

# Get the logs
echo "Getting logs for the production environment..."
vercel logs synthalyst-web.vercel.app

echo "Log check completed." 