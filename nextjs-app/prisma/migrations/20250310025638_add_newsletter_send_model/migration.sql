-- CreateTable
CREATE TABLE "NewsletterSend" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL,
    "sentBy" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterSend_createdAt_idx" ON "NewsletterSend"("createdAt");
