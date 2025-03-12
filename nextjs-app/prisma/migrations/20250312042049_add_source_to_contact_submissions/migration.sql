-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "source" TEXT DEFAULT 'WEBSITE';

-- CreateIndex
CREATE INDEX "ContactSubmission_source_idx" ON "ContactSubmission"("source");
