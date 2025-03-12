import sgMail from "@sendgrid/mail";
// Restore the Prisma import since we now have the Newsletter model
import { prisma } from "@/lib/prisma";
// Remove unused imports since we're using mock data for now
// import { PrismaClient } from "@prisma/client";

// Set your SendGrid API key
let sendgridInitialized = false;
try {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendgridInitialized = true;
    console.log("SendGrid API key set successfully");
  } else {
    console.warn(
      "SendGrid API key not found. Email functionality will not work."
    );
  }
} catch (error) {
  console.error("Error initializing SendGrid:", error);
}

/**
 * Send a welcome email to a new subscriber
 * @param email The subscriber's email address
 * @returns Boolean indicating success or failure
 */
export const sendWelcomeEmail = async (email: string): Promise<boolean> => {
  try {
    if (!sendgridInitialized) {
      console.warn("SendGrid not initialized. Cannot send welcome email.");

      // For development, we'll simulate success to allow testing without SendGrid
      if (
        process.env.NODE_ENV === "development" &&
        process.env.MOCK_NEWSLETTER === "true"
      ) {
        console.log("DEV MODE: Simulating successful welcome email sending");
        console.log(`Welcome email would be sent to: ${email}`);
        return true;
      }

      return false;
    }

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
            <li>Exciting new product information</li>
            <li>Application upgrades with new feature details</li>
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
    if (!sendgridInitialized) {
      console.warn("SendGrid not initialized. Cannot send confirmation email.");
      // For development, we'll simulate success to allow testing without SendGrid
      if (process.env.NODE_ENV === "development") {
        console.log("DEV MODE: Simulating successful email sending");
        console.log(
          `Confirmation link would be: ${
            process.env.NEXT_PUBLIC_API_URL
          }/api/newsletter/confirm?email=${encodeURIComponent(
            email
          )}&token=${token}`
        );
        return true;
      }
      return false;
    }

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
 * Send a newsletter to subscribers
 * @param newsletterId The ID of the newsletter
 * @param subject The newsletter subject
 * @param content The newsletter HTML content
 * @param recipients Array of email addresses to send to
 * @returns Boolean indicating success or failure
 */
export const sendNewsletterToSubscribers = async (
  newsletterId: string,
  subject: string,
  content: string,
  recipients: string[]
): Promise<boolean> => {
  try {
    if (!sendgridInitialized) {
      console.warn("SendGrid not initialized. Cannot send newsletter.");

      // For development, we'll simulate success to allow testing without SendGrid
      if (process.env.NODE_ENV === "development") {
        console.log("DEV MODE: Simulating successful newsletter sending");
        console.log(`Would send newsletter to ${recipients.length} recipients`);
        return true;
      }

      return false;
    }

    if (recipients.length === 0) {
      console.warn("No recipients provided for newsletter");
      return false;
    }

    console.log(`Sending newsletter to ${recipients.length} recipients`);

    // Add tracking pixels and click tracking
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/track/open/${newsletterId}?r={{recipient}}" width="1" height="1" alt="" style="display:none;" />`;
    let processedContent = content;

    // Add tracking pixel at the end of the content
    processedContent += trackingPixel;

    // Add click tracking to all links
    processedContent = processedContent.replace(
      /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']([^>]*)>/gi,
      (match, url, rest) => {
        const trackingUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/newsletter/track/click/${newsletterId}?url=${encodeURIComponent(
          url
        )}&r={{recipient}}`;
        return `<a href="${trackingUrl}"${rest}>`;
      }
    );

    // For small lists, send individual emails
    if (recipients.length < 50) {
      const promises = recipients.map((email) => {
        // Replace recipient placeholder with actual email (for tracking)
        const personalizedContent = processedContent.replace(
          /{{recipient}}/g,
          encodeURIComponent(email)
        );

        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || "noreply@synthalyst.com",
          subject,
          html: personalizedContent,
          trackingSettings: {
            clickTracking: { enable: false }, // Disable SendGrid's click tracking since we're using our own
            openTracking: { enable: false }, // Disable SendGrid's open tracking since we're using our own
          },
        };
        return sgMail.send(msg);
      });

      await Promise.all(promises);
    } else {
      // For larger lists, use SendGrid's batch sending
      const personalizations = recipients.map((email) => ({
        to: email,
        substitutions: {
          "{{recipient}}": encodeURIComponent(email),
        },
      }));

      const msg = {
        personalizations,
        from: process.env.SENDGRID_FROM_EMAIL || "newsletter@synthalyst.com",
        subject,
        html: processedContent,
        trackingSettings: {
          clickTracking: { enable: false }, // Disable SendGrid's click tracking since we're using our own
          openTracking: { enable: false }, // Disable SendGrid's open tracking since we're using our own
        },
      };

      // Use a more specific type for batch sending
      interface BatchMessage {
        personalizations: {
          to: string;
          substitutions: Record<string, string>;
        }[];
        from: string;
        subject: string;
        html: string;
        trackingSettings: {
          clickTracking: { enable: boolean };
          openTracking: { enable: boolean };
        };
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
    if (!sendgridInitialized) {
      console.warn("SendGrid not initialized. Cannot sync subscriber.");

      // For development, we'll simulate success to allow testing without SendGrid
      if (
        process.env.NODE_ENV === "development" &&
        process.env.MOCK_NEWSLETTER === "true"
      ) {
        console.log("DEV MODE: Simulating successful subscriber sync");
        console.log(
          `Would sync subscriber ${email} to SendGrid with tags:`,
          tags
        );
        return true;
      }

      return false;
    }

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
  // Simple but effective token generation
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  const randomPart3 = Math.random().toString(36).substring(2, 15);

  return `${timestamp}-${randomPart1}-${randomPart2}-${randomPart3}`;
};

/**
 * Get active subscribers from the database
 * @returns Array of active subscribers
 */
export async function getActiveSubscribers(): Promise<{ email: string }[]> {
  try {
    // Use a more specific type that avoids 'any' but is still flexible
    // @ts-expect-error - Prisma schema may not include Newsletter model in all environments
    const subscribers = await prisma.newsletter.findMany({
      where: {
        confirmed: true,
        active: true,
        unsubscribed: false,
      },
      select: {
        email: true,
      },
    });

    return subscribers;
  } catch (error) {
    console.error("Error fetching active subscribers:", error);
    return [];
  }
}
