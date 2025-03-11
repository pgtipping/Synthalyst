/*
  Warnings:

  - You are about to drop the column `subscriberId` on the `NewsletterReply` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `NewsletterSend` table. All the data in the column will be lost.
  - You are about to drop the column `confirmExpiry` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `confirmToken` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `NewsletterReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NewsletterSend` table without a default value. This is not possible if the table is not empty.
  - Made the column `filter` on table `NewsletterSend` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NewsletterReply" DROP CONSTRAINT "NewsletterReply_subscriberId_fkey";

-- DropIndex
DROP INDEX "NewsletterReply_subscriberId_idx";

-- DropIndex
DROP INDEX "NewsletterSubscriber_confirmToken_key";

-- AlterTable
ALTER TABLE "NewsletterReply" DROP COLUMN "subscriberId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NewsletterSend" DROP COLUMN "content",
ADD COLUMN     "bounces" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "opens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unsubscribes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "filter" SET NOT NULL,
ALTER COLUMN "filter" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" DROP COLUMN "confirmExpiry",
DROP COLUMN "confirmToken",
DROP COLUMN "status",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ADD COLUMN     "token" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3),
ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unsubscribedAt" TIMESTAMP(3),
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
