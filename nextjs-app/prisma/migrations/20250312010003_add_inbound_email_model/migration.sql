/*
  Warnings:

  - You are about to drop the column `newsletterId` on the `NewsletterUnsubscribeEvent` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `NewsletterUnsubscribeEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewsletterUnsubscribeEvent" DROP CONSTRAINT "NewsletterUnsubscribeEvent_newsletterId_fkey";

-- DropIndex
DROP INDEX "NewsletterUnsubscribeEvent_newsletterId_idx";

-- AlterTable
ALTER TABLE "NewsletterUnsubscribeEvent" DROP COLUMN "newsletterId",
DROP COLUMN "reason",
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "sendId" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "InboundEmail" (
    "id" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromFull" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "textContent" TEXT,
    "htmlContent" TEXT,
    "attachmentCount" INTEGER NOT NULL DEFAULT 0,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "InboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InboundEmail_fromEmail_idx" ON "InboundEmail"("fromEmail");

-- CreateIndex
CREATE INDEX "InboundEmail_processed_idx" ON "InboundEmail"("processed");

-- CreateIndex
CREATE INDEX "NewsletterUnsubscribeEvent_sendId_idx" ON "NewsletterUnsubscribeEvent"("sendId");

-- AddForeignKey
ALTER TABLE "NewsletterUnsubscribeEvent" ADD CONSTRAINT "NewsletterUnsubscribeEvent_sendId_fkey" FOREIGN KEY ("sendId") REFERENCES "NewsletterSend"("id") ON DELETE SET NULL ON UPDATE CASCADE;
