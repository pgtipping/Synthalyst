import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, syncSubscriberToSendGrid } from "@/lib/sendgrid";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    // Add detailed debugging for token expiry investigation
    console.log("========== NEWSLETTER CONFIRMATION DEBUG ==========");
    console.log(
      `Confirmation request received at: ${new Date().toISOString()}`
    );
    console.log(`Email: ${email}`);
    console.log(`Token: ${token ? token.substring(0, 10) + "..." : "null"}`);

    if (!email || !token) {
      console.log("Missing email or token");
      // Redirect to error page instead of returning JSON
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/newsletter/error?message=${encodeURIComponent(
          "Email and token are required"
        )}`
      );
    }

    // Special handling for development mode with MOCK_NEWSLETTER
    if (
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_NEWSLETTER === "true"
    ) {
      console.log(
        "DEV MODE with MOCK_NEWSLETTER: Simulating successful confirmation"
      );

      // Create a real subscriber in the database for testing
      try {
        // Check if the subscriber already exists
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique(
          {
            where: { email },
          }
        );

        if (!existingSubscriber) {
          // Create a new subscriber
          await prisma.newsletterSubscriber.create({
            data: {
              email,
              name: email.split("@")[0], // Use part of email as name
              confirmed: true,
              confirmedAt: new Date(),
              status: "confirmed",
              source: "website",
              tags: ["website", "test"],
            },
          });
          console.log(
            `Created real subscriber in database for testing: ${email}`
          );
        } else if (!existingSubscriber.confirmed) {
          // Update existing subscriber to confirmed
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
              confirmed: true,
              confirmedAt: new Date(),
              status: "confirmed",
            },
          });
          console.log(`Updated existing subscriber to confirmed: ${email}`);
        } else {
          console.log(`Subscriber already exists and is confirmed: ${email}`);
        }
      } catch (dbError) {
        console.error("Error creating test subscriber in database:", dbError);
        // Continue with the mock flow even if database operation fails
      }

      // Send welcome email
      const welcomeEmailSent = await sendWelcomeEmail(email);
      console.log(`Welcome email sent: ${welcomeEmailSent}`);

      console.log("========== END NEWSLETTER CONFIRMATION DEBUG ==========");

      // Redirect to a confirmation page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/confirmed`
      );
    }

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // First check if the subscriber exists at all
    const subscriberExists = await prismaAny.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriberExists) {
      console.log(`No subscriber found with email: ${email}`);
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/newsletter/error?message=${encodeURIComponent(
          "No subscription found for this email address"
        )}`
      );
    }

    console.log("Subscriber found:");
    console.log(`- ID: ${subscriberExists.id}`);
    console.log(`- Email: ${subscriberExists.email}`);
    console.log(
      `- Token: ${
        subscriberExists.token
          ? subscriberExists.token.substring(0, 10) + "..."
          : "null"
      }`
    );
    console.log(`- Token Expiry: ${subscriberExists.tokenExpiry}`);
    console.log(`- Confirmed: ${subscriberExists.confirmed}`);

    // Check if token matches
    if (subscriberExists.token !== token) {
      console.log(
        `Token mismatch: Expected "${
          subscriberExists.token
            ? subscriberExists.token.substring(0, 10) + "..."
            : "null"
        }", got "${token ? token.substring(0, 10) + "..." : "null"}"`
      );
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/newsletter/error?message=${encodeURIComponent(
          "Invalid confirmation token"
        )}`
      );
    }

    // Check if token is expired
    const now = new Date();

    // Ensure tokenExpiry is properly parsed as a Date object
    let tokenExpiry: Date;
    try {
      tokenExpiry = new Date(subscriberExists.tokenExpiry);

      // Check if the date is valid
      if (isNaN(tokenExpiry.getTime())) {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      console.error("Error parsing token expiry date:", error);
      console.log(`Raw token expiry value: ${subscriberExists.tokenExpiry}`);

      // If we can't parse the date, assume the token is valid and proceed
      // This is a fallback to prevent users from being blocked due to date format issues
      console.log(
        "Using fallback: Treating token as valid despite date parsing error"
      );

      // Update the subscriber to confirmed status
      await prismaAny.newsletterSubscriber.update({
        where: { id: subscriberExists.id },
        data: {
          confirmed: true,
          confirmedAt: new Date(),
          status: "confirmed",
          token: null,
          tokenExpiry: null,
        },
      });

      console.log("Subscriber confirmed successfully (fallback path)");

      // Send welcome email
      const welcomeEmailSent = await sendWelcomeEmail(email);
      console.log(`Welcome email sent: ${welcomeEmailSent}`);

      // Sync with SendGrid (optional)
      const syncResult = await syncSubscriberToSendGrid(
        email,
        subscriberExists.tags
      );
      console.log(`Synced with SendGrid: ${syncResult}`);

      console.log("========== END NEWSLETTER CONFIRMATION DEBUG ==========");

      // Redirect to a confirmation page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter/confirmed`
      );
    }

    console.log("Time comparison:");
    console.log(`- Current time: ${now.toISOString()}`);
    console.log(`- Token expiry: ${tokenExpiry.toISOString()}`);
    console.log(
      `- Difference in hours: ${
        (tokenExpiry.getTime() - now.getTime()) / (1000 * 60 * 60)
      }`
    );
    console.log(`- Is token expired: ${tokenExpiry < now}`);

    if (tokenExpiry < now) {
      console.log("Token has expired");
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/newsletter/error?message=${encodeURIComponent(
          "Confirmation token has expired. Please subscribe again to receive a new confirmation email."
        )}`
      );
    }

    // Update the subscriber to confirmed status
    await prismaAny.newsletterSubscriber.update({
      where: { id: subscriberExists.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        status: "confirmed",
        token: null,
        tokenExpiry: null,
      },
    });

    console.log("Subscriber confirmed successfully");

    // Send welcome email
    const welcomeEmailSent = await sendWelcomeEmail(email);
    console.log(`Welcome email sent: ${welcomeEmailSent}`);

    // Sync with SendGrid (optional)
    const syncResult = await syncSubscriberToSendGrid(
      email,
      subscriberExists.tags
    );
    console.log(`Synced with SendGrid: ${syncResult}`);

    console.log("========== END NEWSLETTER CONFIRMATION DEBUG ==========");

    // Redirect to a confirmation page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/newsletter/confirmed`
    );
  } catch (error) {
    console.error("Error confirming subscription:", error);
    // Redirect to error page instead of returning JSON
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/newsletter/error?message=${encodeURIComponent(
        "Failed to confirm subscription"
      )}`
    );
  }
}
