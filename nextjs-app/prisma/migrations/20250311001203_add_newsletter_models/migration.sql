/*
  Warnings:

  - The `filter` column on the `NewsletterSend` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `confirmed` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `subscribedAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribed` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribedAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the `Newsletter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[confirmToken]` on the table `NewsletterSubscriber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `NewsletterSend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NewsletterSubscriber` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "NewsletterSend_createdAt_idx";

-- AlterTable
ALTER TABLE "NewsletterSend" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
DROP COLUMN "filter",
ADD COLUMN     "filter" JSONB;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" DROP COLUMN "confirmed",
DROP COLUMN "confirmedAt",
DROP COLUMN "source",
DROP COLUMN "subscribedAt",
DROP COLUMN "unsubscribed",
DROP COLUMN "unsubscribedAt",
ADD COLUMN     "confirmExpiry" TIMESTAMP(3),
ADD COLUMN     "confirmToken" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Newsletter";

-- CreateTable
CREATE TABLE "NewsletterTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "NewsletterTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "sendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterTemplate_createdById_idx" ON "NewsletterTemplate"("createdById");

-- CreateIndex
CREATE INDEX "NewsletterReply_subscriberId_idx" ON "NewsletterReply"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterReply_sendId_idx" ON "NewsletterReply"("sendId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_confirmToken_key" ON "NewsletterSubscriber"("confirmToken");

-- AddForeignKey
ALTER TABLE "NewsletterTemplate" ADD CONSTRAINT "NewsletterTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterReply" ADD CONSTRAINT "NewsletterReply_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterReply" ADD CONSTRAINT "NewsletterReply_sendId_fkey" FOREIGN KEY ("sendId") REFERENCES "NewsletterSend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
