# Deployment Guide for Synthalyst

This guide explains how to properly deploy the Synthalyst application to ensure that all components, including the database, are correctly updated.

## Prerequisites

- Vercel CLI installed (`npm install -g vercel`)
- Access to the Vercel project
- Git access to the repository

## Deployment Steps

### 1. Prepare for Deployment

Make sure all your changes are committed and pushed to the main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Run the Deployment Script

The deployment script will handle:

- Installing dependencies
- Running database migrations
- Generating the Prisma client
- Building the application

```bash
cd nextjs-app
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 3. Deploy to Vercel

Deploy to Vercel using one of these methods:

#### Option 1: Using Vercel CLI

```bash
# From the root directory (synthalyst)
vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. Go to the [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Click on "Deployments"
4. Click "Deploy" or set up automatic deployments from your GitHub repository

### 4. Verify Database Migrations

After deployment, verify that the database migrations have been applied:

```bash
cd nextjs-app
npx prisma migrate status --schema=./prisma/schema.prisma
```

### Troubleshooting

#### Database Migration Issues

If you encounter database migration issues in production:

1. Connect to the production database
2. Run migrations manually:
   ```bash
   DATABASE_URL=your_production_db_url npx prisma migrate deploy
   ```

#### Contact Form Errors

If the contact form is still showing errors after deployment:

1. Check if the EmailLog model exists in the production database
2. Verify that the Prisma client has been regenerated with the latest schema
3. Check the logs for any specific error messages

## Important Notes

- Always run database migrations before deploying new code
- The `hasEmailLogModel()` function in `src/lib/email.ts` is designed to gracefully handle missing models
- The contact form will still work even if the EmailLog model doesn't exist, but logging will be disabled
