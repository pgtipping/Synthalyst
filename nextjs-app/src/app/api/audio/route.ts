import { NextRequest, NextResponse } from "next/server";
import { audioStorage } from "@/lib/storage/audioStorage";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the audio blob from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Check file size if configured
    const maxSize = parseInt(process.env.MAX_AUDIO_FILE_SIZE || "10485760", 10); // Default 10MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "Audio file too large" },
        { status: 400 }
      );
    }

    // Check MIME type if configured
    const allowedTypes = (
      process.env.ALLOWED_AUDIO_MIME_TYPES ||
      "audio/webm,audio/mp4,audio/mpeg,audio/wav"
    ).split(",");
    if (audioFile.type && !allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: "Invalid audio file type" },
        { status: 400 }
      );
    }

    // Get user session if available
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Save the audio file using our storage utility
    const { url, filename } = await audioStorage.saveAudio(audioFile);

    // Store recording information in the database
    const recording = await db.audioRecording.create({
      data: {
        filename,
        url,
        userId: userId || null,
      },
    });

    // Return the URL to the saved audio file
    return NextResponse.json({
      url,
      filename,
      id: recording.id,
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
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const id = searchParams.get("id");

    if (!filename && !id) {
      return NextResponse.json(
        { error: "No filename or id provided" },
        { status: 400 }
      );
    }

    let audioFilename = filename;

    // If id is provided, look up the recording in the database
    if (id) {
      const recording = await db.audioRecording.findUnique({
        where: { id },
      });

      if (!recording) {
        return NextResponse.json(
          { error: "Recording not found" },
          { status: 404 }
        );
      }

      audioFilename = recording.filename;
    }

    // Get the URL for the audio file
    const url = await audioStorage.getAudioUrl(audioFilename!);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error retrieving audio:", error);
    return NextResponse.json(
      { error: "Failed to retrieve audio file" },
      { status: 500 }
    );
  }
}
