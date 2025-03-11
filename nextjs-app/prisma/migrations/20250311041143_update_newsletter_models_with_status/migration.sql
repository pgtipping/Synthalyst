-- AlterTable
ALTER TABLE "NewsletterSend" ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
