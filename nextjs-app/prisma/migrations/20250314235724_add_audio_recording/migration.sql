-- CreateTable
CREATE TABLE "AudioRecording" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioRecording_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AudioRecording_userId_idx" ON "AudioRecording"("userId");
