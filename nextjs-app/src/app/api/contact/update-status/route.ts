import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Define validation schema
const updateStatusSchema = z.object({
  id: z.string().min(1, "ID is required"),
  status: z.string().min(1, "Status is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (
      session.user.role !== "ADMIN" &&
      session.user.email !== "pgtipping1@gmail.com"
    ) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate the data
    const validatedData = updateStatusSchema.parse(body);

    // Create a FormData object to send to the admin endpoint
    const formData = new FormData();
    formData.append("status", validatedData.status);

    // Forward the request to the admin endpoint
    const adminResponse = await fetch(
      `${request.nextUrl.origin}/api/admin/contact-submissions/${validatedData.id}/update-status`,
      {
        method: "POST",
        body: formData,
        headers: {
          // Pass the session cookie
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!adminResponse.ok) {
      const errorData = await adminResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Failed to update status",
        },
        { status: adminResponse.status }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Status update error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update status",
      },
      { status: 500 }
    );
  }
}
