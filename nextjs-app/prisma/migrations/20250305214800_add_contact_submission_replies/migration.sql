-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "lastRepliedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ContactSubmissionReply" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmissionReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactSubmissionReply_submissionId_idx" ON "ContactSubmissionReply"("submissionId");

-- CreateIndex
CREATE INDEX "ContactSubmissionReply_sentAt_idx" ON "ContactSubmissionReply"("sentAt");

-- AddForeignKey
ALTER TABLE "ContactSubmissionReply" ADD CONSTRAINT "ContactSubmissionReply_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
