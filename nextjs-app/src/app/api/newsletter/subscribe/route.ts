import { NextRequest } from "next/server";
import {
  createHandler,
  successResponse,
  errorResponse,
} from "@/lib/api/handler";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const subscribeSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

type SubscribeInput = z.infer<typeof subscribeSchema>;

export const POST = createHandler<SubscribeInput>(
  async (req: NextRequest, _params, body) => {
    if (!body) {
      return errorResponse("Request body is required", "BAD_REQUEST", 400);
    }

    try {
      const { email } = body;

      // Check if email already exists
      const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (existingSubscriber) {
        // If already subscribed but not confirmed, we could resend confirmation
        // For now, just return success to avoid revealing if email exists
        return successResponse({
          message: "Thank you for subscribing to our newsletter!",
        });
      }

      // Create new subscriber
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          subscribedAt: new Date(),
          // In a real implementation, you might set confirmed: false
          // and send a confirmation email with a token
          confirmed: true,
        },
      });

      return successResponse({
        message: "Thank you for subscribing to our newsletter!",
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return errorResponse(
        "Failed to process subscription",
        "INTERNAL_SERVER_ERROR",
        500
      );
    }
  },
  {
    validationSchema: subscribeSchema,
  }
);
