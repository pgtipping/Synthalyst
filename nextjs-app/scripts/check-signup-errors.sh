#!/bin/bash

# Check Vercel logs for signup-related errors

echo "Checking Vercel logs for signup-related errors..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
vercel whoami || vercel login

# Get the logs for the signup API route
echo "Getting logs for the signup API route..."
vercel logs synthalyst-web.vercel.app --path=/api/auth/signup

echo "Signup error check completed." 