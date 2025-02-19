import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Here you would typically integrate with your email service
    // For example, using nodemailer, SendGrid, or another email service
    console.log("Contact form submission:", { name, email, subject, message });

    // For now, we'll just return a success response
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
