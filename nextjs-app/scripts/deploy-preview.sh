#!/bin/bash

# Deploy Preview Script for Synthalyst

echo "🚀 Creating Vercel Preview Deployment"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it with 'npm install -g vercel'"
    exit 1
fi

# Copy the vercel.json to the current directory if it doesn't exist
if [ ! -f "vercel.json" ]; then
    echo "📝 Creating vercel.json in the current directory"
    cat > vercel.json << 'EOL'
{
  "version": 2,
  "name": "synthalyst-preview",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_BASE_URL": "https://synthalyst-preview.vercel.app",
    "NEXT_PUBLIC_APP_URL": "https://synthalyst-preview.vercel.app",
    "NEXTAUTH_URL": "https://synthalyst-preview.vercel.app",
    "NEXT_PUBLIC_VERCEL_ENV": "preview",
    "NEXT_TELEMETRY_DISABLED": "1",
    "VERCEL": "1",
    "VERCEL_ENV": "preview",
    "NODE_OPTIONS": "--max-old-space-size=4096"
  }
}
EOL
fi

# Deploy to Vercel
echo "🔄 Deploying to Vercel..."
vercel --confirm

echo "✅ Deployment initiated. Check the Vercel dashboard for deployment status." 