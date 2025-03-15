import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { S3Client as S3ClientType } from "@aws-sdk/client-s3";
import type {
  PutObjectCommand as PutObjectCommandType,
  GetObjectCommand as GetObjectCommandType,
} from "@aws-sdk/client-s3";
import type { getSignedUrl as GetSignedUrlType } from "@aws-sdk/s3-request-presigner";

// Import S3 client only if needed (to avoid issues in environments without AWS SDK)
let S3Client: typeof S3ClientType;
let PutObjectCommand: typeof PutObjectCommandType;
let GetObjectCommand: typeof GetObjectCommandType;
let getSignedUrl: typeof GetSignedUrlType;

// Dynamically import AWS SDK if using S3 storage
if (process.env.AUDIO_STORAGE_TYPE === "s3") {
  const importS3 = async () => {
    const {
      S3Client: S3ClientImport,
      PutObjectCommand: PutObjectCommandImport,
      GetObjectCommand: GetObjectCommandImport,
    } = await import("@aws-sdk/client-s3");
    const { getSignedUrl: getSignedUrlImport } = await import(
      "@aws-sdk/s3-request-presigner"
    );

    S3Client = S3ClientImport;
    PutObjectCommand = PutObjectCommandImport;
    GetObjectCommand = GetObjectCommandImport;
    getSignedUrl = getSignedUrlImport;
  };

  importS3().catch(console.error);
}

// Storage interface
export interface AudioStorage {
  saveAudio(
    audioBlob: Blob,
    filename?: string
  ): Promise<{ url: string; filename: string }>;
  getAudioUrl(filename: string): Promise<string>;
}

// Local file system storage implementation
class LocalAudioStorage implements AudioStorage {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    if (!existsSync(this.uploadsDir)) {
      mkdir(this.uploadsDir, { recursive: true }).catch(console.error);
    }
  }

  async saveAudio(
    audioBlob: Blob,
    filename?: string
  ): Promise<{ url: string; filename: string }> {
    // Generate filename if not provided
    const actualFilename = filename || `${uuidv4()}.webm`;
    const filepath = path.join(this.uploadsDir, actualFilename);

    // Convert blob to buffer and save
    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    await writeFile(filepath, buffer);

    // Return public URL
    return {
      url: `/uploads/${actualFilename}`,
      filename: actualFilename,
    };
  }

  async getAudioUrl(filename: string): Promise<string> {
    return `/uploads/${filename}`;
  }
}

// S3 storage implementation
class S3AudioStorage implements AudioStorage {
  private s3Client: InstanceType<typeof S3ClientType>;
  private bucket: string;
  private audioPath: string;
  private urlExpiration: number;

  constructor() {
    if (!S3Client) {
      throw new Error(
        "AWS SDK not loaded. Make sure to set AUDIO_STORAGE_TYPE=s3 and install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner"
      );
    }

    this.bucket = process.env.AWS_S3_BUCKET || "";
    this.audioPath = process.env.AWS_S3_AUDIO_PATH || "audio-uploads";
    this.urlExpiration = parseInt(
      process.env.AWS_S3_URL_EXPIRATION || "3600",
      10
    );

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async saveAudio(
    audioBlob: Blob,
    filename?: string
  ): Promise<{ url: string; filename: string }> {
    // Generate filename if not provided
    const actualFilename = filename || `${uuidv4()}.webm`;
    const key = `${this.audioPath}/${actualFilename}`;

    // Convert blob to buffer and upload to S3
    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: audioBlob.type || "audio/webm",
    });

    await this.s3Client.send(command);

    // Generate signed URL
    const url = await this.getAudioUrl(actualFilename);

    return {
      url,
      filename: actualFilename,
    };
  }

  async getAudioUrl(filename: string): Promise<string> {
    const key = `${this.audioPath}/${filename}`;
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    // Generate signed URL with expiration
    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpiration,
    });
  }
}

// Factory function to create the appropriate storage implementation
export function createAudioStorage(): AudioStorage {
  const storageType = process.env.AUDIO_STORAGE_TYPE || "local";

  try {
    switch (storageType) {
      case "s3":
        // Check if AWS SDK is loaded
        if (!S3Client) {
          console.warn("AWS SDK not loaded, falling back to local storage");
          return new LocalAudioStorage();
        }
        return new S3AudioStorage();
      case "local":
      default:
        return new LocalAudioStorage();
    }
  } catch (error) {
    console.error("Error creating audio storage:", error);
    return new LocalAudioStorage();
  }
}

// Export a singleton instance
export const audioStorage = createAudioStorage();
