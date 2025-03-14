import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const filename = `${uuidv4()}.webm`;
    const filepath = path.join(UPLOADS_DIR, filename);

    // Convert blob to buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Ensure uploads directory exists
    await writeFile(filepath, buffer);

    // Return the file URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error saving audio:", error);
    return NextResponse.json(
      { error: "Failed to save audio file" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filename = url.searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "No filename provided" },
      { status: 400 }
    );
  }

  const filepath = path.join(UPLOADS_DIR, filename);

  try {
    // Return file as downloadable
    const response = new NextResponse(filepath);
    response.headers.set("Content-Type", "audio/webm");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    return response;
  } catch (error) {
    console.error("Error serving audio:", error);
    return NextResponse.json(
      { error: "Failed to serve audio file" },
      { status: 500 }
    );
  }
}
