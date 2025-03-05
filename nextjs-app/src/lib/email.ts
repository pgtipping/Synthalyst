import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn(
    "SENDGRID_API_KEY is not set. Email functionality will not work."
  );
}

export interface EmailData {
  to: string;
  from: string | { email: string; name: string };
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email using SendGrid
 * @param emailData The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("Cannot send email: SENDGRID_API_KEY is not set");
      return false;
    }

    await sgMail.send(emailData as sgMail.MailDataRequired);
    console.log(`Email sent successfully to ${emailData.to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send a reply to a contact submission
 * @param to Recipient email address
 * @param subject Email subject
 * @param message Email message (HTML)
 * @param fromName Name to display in the from field
 * @returns A promise that resolves to true if the email was sent successfully
 */
export async function sendContactReply(
  to: string,
  subject: string,
  message: string,
  fromName: string = "Synthalyst Support"
): Promise<boolean> {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "support@synthalyst.com";

  const emailData: EmailData = {
    to,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject,
    text: message.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    html: message,
  };

  return sendEmail(emailData);
}
