import sgMail from "@sendgrid/mail";
// Remove unused imports since we're using mock data for now
// import { prisma } from "@/lib/prisma";
// import { PrismaClient } from "@prisma/client";

// Set your SendGrid API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn(
    "SendGrid API key not found. Email functionality will not work."
  );
}

/**
 * Send a welcome email to a new subscriber
 * @param email The subscriber's email address
 * @returns Boolean indicating success or failure
 */
export const sendWelcomeEmail = async (email: string): Promise<boolean> => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@synthalyst.com",
      subject: "Welcome to Synthalyst Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Synthalyst!</h1>
          <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates, insights, and tips with you.</p>
          <p>You'll receive our newsletter with valuable content about:</p>
          <ul>
            <li>AI and machine learning developments</li>
            <li>Training plan creation tips</li>
            <li>Productivity enhancements</li>
            <li>And much more!</li>
          </ul>
          <p>If you have any questions or feedback, feel free to reply to this email.</p>
          <p>Best regards,<br>The Synthalyst Team</p>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            If you didn't sign up for this newsletter, please <a href="${
              process.env.NEXT_PUBLIC_API_URL
            }/api/newsletter/unsubscribe?email=${encodeURIComponent(
        email
      )}">click here to unsubscribe</a>.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

/**
 * Send a confirmation email with a token to verify the subscription
 * @param email The subscriber's email address
 * @param token The verification token
 * @returns Boolean indicating success or failure
 */
export const sendConfirmationEmail = async (
  email: string,
  token: string
): Promise<boolean> => {
  try {
    const confirmationLink = `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@synthalyst.com",
      subject: "Confirm Your Synthalyst Newsletter Subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Confirm Your Subscription</h1>
          <p>Thank you for subscribing to the Synthalyst newsletter. To complete your subscription, please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm Subscription</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${confirmationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't sign up for this newsletter, you can safely ignore this email.</p>
          <p>Best regards,<br>The Synthalyst Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

/**
 * Send a newsletter to all active subscribers
 * @param subject The newsletter subject
 * @param content The newsletter HTML content
 * @returns Boolean indicating success or failure
 */
export const sendNewsletterToSubscribers = async (
  subject: string,
  content: string
): Promise<boolean> => {
  try {
    // Get subscribers from database
    const subscribers = await getActiveSubscribers();

    if (subscribers.length === 0) {
      console.warn("No active subscribers found for this segment");
      return false;
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // For small lists, send individual emails
    if (subscribers.length < 50) {
      const promises = subscribers.map((subscriber) => {
        const msg = {
          to: subscriber.email,
          from: process.env.SENDGRID_FROM_EMAIL || "noreply@synthalyst.com",
          subject,
          html: content,
        };
        return sgMail.send(msg);
      });

      await Promise.all(promises);
    } else {
      // For larger lists, use SendGrid's batch sending
      const personalizations = subscribers.map(
        (subscriber: { email: string }) => ({
          to: subscriber.email,
        })
      );

      const msg = {
        personalizations,
        from: process.env.SENDGRID_FROM_EMAIL || "newsletter@synthalyst.com",
        subject,
        html: content,
      };

      // Use a more specific type for batch sending
      interface BatchMessage {
        personalizations: { to: string }[];
        from: string;
        subject: string;
        html: string;
      }

      await sgMail.send(msg as BatchMessage);
    }

    return true;
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return false;
  }
};

/**
 * Sync a subscriber to SendGrid contacts
 * @param email The subscriber's email address
 * @param tags Optional tags to add to the contact
 * @returns Boolean indicating success or failure
 */
export const syncSubscriberToSendGrid = async (
  email: string,
  tags: string[] = []
): Promise<boolean> => {
  try {
    // This would use SendGrid's Contacts API to sync subscribers
    // For now, we'll just log the action
    console.log(`Syncing subscriber ${email} to SendGrid with tags:`, tags);

    // In a real implementation, you would use the SendGrid Contacts API
    // Example: https://github.com/sendgrid/sendgrid-nodejs/blob/main/packages/client/USAGE.md#contacts-api

    return true;
  } catch (error) {
    console.error("Error syncing subscriber to SendGrid:", error);
    return false;
  }
};

/**
 * Generate a random token for email confirmation
 * @returns A random string token
 */
export const generateToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Get active subscribers from the database
 * @returns Array of active subscribers
 */
export async function getActiveSubscribers(): Promise<{ email: string }[]> {
  try {
    // Since we're still setting up the database schema, we'll return mock data for now
    // This will be replaced with actual database queries once the schema is finalized

    // Mock data for development
    return [
      { email: "test1@example.com" },
      { email: "test2@example.com" },
      { email: "test3@example.com" },
    ];

    // Once the database schema is finalized, uncomment this code:
    /*
    const subscribers = await prisma.newsletter.findMany({
      where: {
        active: true,
        confirmed: true,
      },
      select: {
        email: true,
      },
    });
    
    return subscribers;
    */
  } catch (error) {
    console.error("Error fetching active subscribers:", error);
    return [];
  }
}
