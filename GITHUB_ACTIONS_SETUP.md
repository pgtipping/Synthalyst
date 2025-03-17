# Setting Up GitHub Actions for Vercel Deployment

This guide explains how to set up GitHub Actions to automatically deploy your Synthalyst application to Vercel.

## Prerequisites

- GitHub repository with your Synthalyst code
- Vercel account with your project set up
- Admin access to both GitHub and Vercel

## Step 1: Get Vercel Tokens and IDs

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Link your project (if not already linked):

   ```bash
   cd nextjs-app
   vercel link
   ```

4. Get your Vercel tokens and IDs:

   ```bash
   vercel whoami
   # This will give you your user ID

   vercel teams ls
   # If you're using a team, this will give you your team ID (org ID)

   vercel projects ls
   # This will give you your project ID
   ```

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel API token (get from Vercel dashboard > Settings > Tokens)
   - `VERCEL_ORG_ID`: Your Vercel organization ID (or user ID if not using a team)
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## Step 3: Push the Workflow File

The workflow file is already created at `.github/workflows/deploy.yml`. Push it to GitHub:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for Vercel deployment"
git push origin main
```

## Step 4: Monitor the Deployment

1. Go to your GitHub repository
2. Click on "Actions" tab
3. You should see the "Deploy to Vercel" workflow running
4. Click on it to see the details and logs

## Troubleshooting

If the deployment fails, check the following:

1. Verify that all secrets are correctly set in GitHub
2. Check the logs in the GitHub Actions tab
3. Make sure your Vercel project is correctly set up
4. Ensure that your Vercel token has the necessary permissions

## Manual Deployment

If GitHub Actions deployment fails, you can still deploy manually:

1. Go to the Vercel dashboard
2. Select your project
3. Click on "Deployments"
4. Click "Deploy" or connect your GitHub repository for automatic deployments
