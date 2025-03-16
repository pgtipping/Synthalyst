import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, sendConfirmationEmail } from "@/lib/sendgrid";
import { z } from "zod";

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().optional(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const result = subscribeSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.format());
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, source, name } = result.data;

    // In development mode, we can simulate success even if the database isn't set up
    if (
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_NEWSLETTER === "true"
    ) {
      console.log(
        "DEV MODE with MOCK_NEWSLETTER: Simulating successful subscription"
      );
      const token = generateToken();

      // Create a pending subscriber in the database for testing
      try {
        // Check if the subscriber already exists
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique(
          {
            where: { email },
          }
        );

        if (!existingSubscriber) {
          // Create a new subscriber with pending status
          await prisma.newsletterSubscriber.create({
            data: {
              email,
              name: name || email.split("@")[0], // Use provided name or part of email
              confirmed: false,
              status: "pending",
              source: source || "website",
              tags: source ? [source] : ["website"],
              token,
              tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
          });
          console.log(
            `Created pending subscriber in database for testing: ${email}`
          );
        } else if (existingSubscriber.confirmed) {
          console.log(`Subscriber already exists and is confirmed: ${email}`);
          return NextResponse.json(
            { message: "You are already subscribed to our newsletter" },
            { status: 200 }
          );
        } else {
          // Update existing subscriber with new token
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
              token,
              tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
          });
          console.log(`Updated existing subscriber with new token: ${email}`);
        }
      } catch (dbError) {
        console.error("Error creating test subscriber in database:", dbError);
        // Continue with the mock flow even if database operation fails
      }

      try {
        await sendConfirmationEmail(email, token);
        return NextResponse.json(
          {
            message:
              "Subscription initiated. Please check your email to confirm.",
          },
          { status: 201 }
        );
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        return NextResponse.json(
          {
            error: "Failed to send confirmation email. Please try again later.",
            details: String(emailError),
          },
          { status: 500 }
        );
      }
    }

    try {
      // Check if the email is already subscribed
      try {
        // Use type assertion to work around the type error
        const prismaAny = prisma as any;

        const existingSubscriber =
          await prismaAny.newsletterSubscriber.findUnique({
            where: { email },
          });

        if (existingSubscriber) {
          // If already confirmed, return success
          if (existingSubscriber.confirmed) {
            return NextResponse.json(
              { message: "You are already subscribed to our newsletter" },
              { status: 200 }
            );
          }

          // If not confirmed, generate a new token and send confirmation email
          const token = generateToken();
          // Set token expiry to 24 hours
          const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

          await prismaAny.newsletterSubscriber.update({
            where: { email },
            data: {
              token,
              tokenExpiry,
            },
          });

          try {
            await sendConfirmationEmail(email, token);
            return NextResponse.json(
              { message: "Confirmation email sent. Please check your inbox." },
              { status: 200 }
            );
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            return NextResponse.json(
              {
                error:
                  "Failed to send confirmation email. Please try again later.",
                details:
                  process.env.NODE_ENV === "development"
                    ? String(emailError)
                    : undefined,
              },
              { status: 500 }
            );
          }
        }

        // Create a new subscriber
        const token = generateToken();
        // Set token expiry to 24 hours
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prismaAny.newsletterSubscriber.create({
          data: {
            email,
            name,
            source,
            token,
            tokenExpiry,
            tags: source ? [source] : [],
          },
        });

        // Send confirmation email
        try {
          await sendConfirmationEmail(email, token);
          return NextResponse.json(
            {
              message:
                "Subscription initiated. Please check your email to confirm.",
            },
            { status: 201 }
          );
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          return NextResponse.json(
            {
              error:
                "Subscription created but failed to send confirmation email. Please try again later.",
              details:
                process.env.NODE_ENV === "development"
                  ? String(emailError)
                  : undefined,
            },
            { status: 500 }
          );
        }
      } catch (modelError) {
        console.error("Model error:", modelError);

        // If we're in development mode, we can still send a confirmation email
        if (process.env.NODE_ENV === "development") {
          const token = generateToken();
          try {
            await sendConfirmationEmail(email, token);
            return NextResponse.json(
              {
                message:
                  "Development mode: Subscription simulated. Please check your email to confirm.",
                details:
                  "Note: Database operations were skipped due to schema issues.",
              },
              { status: 201 }
            );
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            return NextResponse.json(
              {
                error:
                  "Failed to send confirmation email. Please try again later.",
                details: String(emailError),
              },
              { status: 500 }
            );
          }
        }

        throw modelError;
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error:
            "Database error. The newsletter feature may not be fully set up yet.",
          details:
            process.env.NODE_ENV === "development"
              ? String(dbError)
              : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      {
        error: "Failed to subscribe to newsletter. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
