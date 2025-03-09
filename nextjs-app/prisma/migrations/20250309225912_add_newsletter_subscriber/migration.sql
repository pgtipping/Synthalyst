/*
  Warnings:

  - You are about to drop the column `isPublic` on the `CompetencyFrameworkFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `llmImprovementSuggestion` on the `CompetencyFrameworkFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `llmQualityFeedback` on the `CompetencyFrameworkFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CompetencyFrameworkFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `ContactSubmissionReply` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `ContactSubmissionReply` table. All the data in the column will be lost.
  - You are about to drop the column `sentBy` on the `ContactSubmissionReply` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `ContactSubmissionReply` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `ContactSubmissionReply` table. All the data in the column will be lost.
  - Added the required column `contactSubmissionId` to the `ContactSubmissionReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `ContactSubmissionReply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContactSubmissionReply" DROP CONSTRAINT "ContactSubmissionReply_submissionId_fkey";

-- DropIndex
DROP INDEX "CompetencyFrameworkFeedback_frameworkId_idx";

-- DropIndex
DROP INDEX "CompetencyFrameworkFeedback_userId_idx";

-- DropIndex
DROP INDEX "ContactSubmissionReply_sentAt_idx";

-- DropIndex
DROP INDEX "ContactSubmissionReply_submissionId_idx";

-- AlterTable
ALTER TABLE "CompetencyFrameworkFeedback" DROP COLUMN "isPublic",
DROP COLUMN "llmImprovementSuggestion",
DROP COLUMN "llmQualityFeedback",
DROP COLUMN "updatedAt",
ALTER COLUMN "feedback" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ContactSubmissionReply" DROP COLUMN "message",
DROP COLUMN "sentAt",
DROP COLUMN "sentBy",
DROP COLUMN "subject",
DROP COLUMN "submissionId",
ADD COLUMN     "contactSubmissionId" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribedAt" TIMESTAMP(3),
    "source" TEXT,
    "tags" TEXT[],

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "ContactSubmissionReply" ADD CONSTRAINT "ContactSubmissionReply_contactSubmissionId_fkey" FOREIGN KEY ("contactSubmissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
