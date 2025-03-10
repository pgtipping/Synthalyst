-- AlterTable
ALTER TABLE "ContactSubmissionReply" ADD COLUMN     "reference" TEXT;

-- CreateIndex
CREATE INDEX "ContactSubmissionReply_contactSubmissionId_idx" ON "ContactSubmissionReply"("contactSubmissionId");
