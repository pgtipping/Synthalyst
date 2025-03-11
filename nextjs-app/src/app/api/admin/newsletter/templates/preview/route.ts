import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/middleware/rateLimit";

// POST /api/admin/newsletter/templates/preview - Preview a template
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting - now using prefixed keys
    const rateLimitResult = await rateLimit(req, {
      max: 10, // 10 requests per minute
      windowInSeconds: 60,
    });

    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, subject, testData } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Process the template with test data if provided
    let processedContent = content;
    let processedSubject = subject || "Newsletter Preview";

    if (testData) {
      // Replace placeholders in content and subject
      Object.entries(testData).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        processedContent = processedContent.replace(placeholder, String(value));

        if (subject) {
          processedSubject = processedSubject.replace(
            placeholder,
            String(value)
          );
        }
      });
    }

    // Add preview wrapper with styles
    const previewHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${processedSubject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          .preview-banner {
            background-color: #f8f9fa;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
            border-left: 4px solid #0070f3;
            font-size: 14px;
          }
          .preview-subject {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .preview-content {
            border: 1px solid #e1e4e8;
            border-radius: 4px;
            padding: 20px;
            background-color: #fff;
          }
        </style>
      </head>
      <body>
        <div class="preview-banner">
          <div class="preview-subject">Subject: ${processedSubject}</div>
          <div>This is a preview of your newsletter.</div>
        </div>
        <div class="preview-content">
          ${processedContent}
        </div>
      </body>
      </html>
    `;

    return new NextResponse(previewHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating template preview:", error);
    return NextResponse.json(
      { error: "Failed to generate template preview" },
      { status: 500 }
    );
  }
}
