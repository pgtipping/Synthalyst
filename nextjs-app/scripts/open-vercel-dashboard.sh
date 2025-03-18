#!/bin/bash

# Script to open the Vercel dashboard for manual deployment

echo "🔗 Opening Vercel dashboard for Synthalyst project..."

# Open the Vercel dashboard in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open "https://vercel.com/pascal-georges-projects/synthalyst-web"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  xdg-open "https://vercel.com/pascal-georges-projects/synthalyst-web"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows
  start "https://vercel.com/pascal-georges-projects/synthalyst-web"
else
  echo "Please visit: https://vercel.com/pascal-georges-projects/synthalyst-web"
fi

echo "✅ Please use the Vercel dashboard to deploy your project."
echo "1. Click on 'New Deployment' or connect a Git repository"
echo "2. Set the root directory to 'nextjs-app'"
echo "3. Update environment variables if needed"
echo "4. Click 'Deploy'" 