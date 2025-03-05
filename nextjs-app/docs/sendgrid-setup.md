# SendGrid Email Integration Setup

This document explains how to set up SendGrid email integration for the Synthalyst application.

## Prerequisites

1. A SendGrid account (sign up at [sendgrid.com](https://sendgrid.com/))
2. Verified sender identity (domain or single sender)
3. API key with appropriate permissions

## Setup Steps

### 1. Create a SendGrid Account

If you don't already have a SendGrid account, sign up for one at [sendgrid.com](https://sendgrid.com/). The free tier includes 100 emails per day, which should be sufficient for development and testing.

### 2. Verify Your Sender Identity

SendGrid requires you to verify your sender identity before you can send emails. You can verify either:

- **Single Sender Verification**: Verify a single email address
- **Domain Verification**: Verify an entire domain (recommended for production)

To verify a sender:

1. In your SendGrid dashboard, go to Settings > Sender Authentication
2. Choose either "Verify a Single Sender" or "Domain Authentication"
3. Follow the instructions provided by SendGrid

### 3. Create an API Key

1. In your SendGrid dashboard, go to Settings > API Keys
2. Click "Create API Key"
3. Name your API key (e.g., "Synthalyst Email API")
4. Select "Restricted Access" and ensure "Mail Send" permissions are enabled
5. Click "Create & View"
6. Copy your API key (you will only see it once)

### 4. Configure Environment Variables

Add the following variables to your `.env` file:

```
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="your-verified-email@yourdomain.com"
```

Make sure to replace the values with your actual SendGrid API key and verified sender email.

### 5. Test the Integration

To test if your SendGrid integration is working:

1. Navigate to the admin contact submissions page
2. Open a submission and click "Reply"
3. Fill out the form and send a test email to yourself
4. Check your inbox to confirm the email was delivered

## Troubleshooting

If emails are not being sent:

1. Check the server logs for any error messages
2. Verify that your API key is correct and has the necessary permissions
3. Ensure your sender email is verified
4. Check if you've reached your daily sending limit (100 emails on the free plan)

## Additional Resources

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Node.js SDK](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Delivery Best Practices](https://sendgrid.com/blog/10-tips-to-keep-email-out-of-the-spam-folder/)
