# Synthalyst - AI-Powered Software Engineering Platform

## Overview

Synthalyst is an AI-powered platform designed to enhance software engineering and development workflows. It provides tools for creating training plans, interview preparation, job description development, and more.

## Features

- **Training Plan Creator**: Generate customized training plans for learning technologies
- **Interview Preparation**: Practice and prepare for technical interviews
- **Job Description Developer**: Create and customize job descriptions
- **Competency Manager**: Track and develop technical competencies
- **Admin Dashboard**: Manage users, blog posts, and contact submissions

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Prisma
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI, Google Gemini, Groq
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Various API keys (see .env.example)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/synthalyst.git
   cd synthalyst
   ```

2. Install dependencies:

   ```bash
   cd nextjs-app
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3001` to access the application.

## Deployment

### Deploying to Vercel

1. Make sure you have the Vercel CLI installed:

   ```bash
   npm install -g vercel
   ```

2. Make sure all your changes are committed:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. Deploy using the simplified build process:
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

The following environment variables need to be set in your Vercel project settings:

- `NEXTAUTH_URL`: Your production URL (e.g., https://synthalyst.vercel.app)
- `NEXT_PUBLIC_BASE_URL`: Same as NEXTAUTH_URL
- `NEXT_PUBLIC_API_URL`: Same as NEXTAUTH_URL
- `DATABASE_URL`: Your PostgreSQL connection string with SSL enabled
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- All API keys from your development .env file

### Troubleshooting Deployment Issues

If you encounter deployment issues, refer to:

- DEPLOYMENT_GUIDE.md for standard deployment procedures
- DEPLOYMENT_FIX.md for solutions to common deployment problems

#### Common Fixes

1. **Contact Submissions Component**: Make sure index files are correctly set up for component exports.
2. **Database Migration Issues**: Run `prisma migrate deploy` manually if needed.
3. **Build Process Errors**: Ensure the build script has executable permissions (`chmod +x scripts/simple-build.js`).

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss your ideas.

## License

This project is proprietary and not licensed for public use without permission.
