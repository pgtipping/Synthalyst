-- CreateTable
CREATE TABLE "NewsletterOpenEvent" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterOpenEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterClickEvent" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterBounceEvent" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterBounceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterUnsubscribeEvent" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterUnsubscribeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterOpenEvent_newsletterId_idx" ON "NewsletterOpenEvent"("newsletterId");

-- CreateIndex
CREATE INDEX "NewsletterOpenEvent_subscriberId_idx" ON "NewsletterOpenEvent"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterClickEvent_newsletterId_idx" ON "NewsletterClickEvent"("newsletterId");

-- CreateIndex
CREATE INDEX "NewsletterClickEvent_subscriberId_idx" ON "NewsletterClickEvent"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterClickEvent_url_idx" ON "NewsletterClickEvent"("url");

-- CreateIndex
CREATE INDEX "NewsletterBounceEvent_newsletterId_idx" ON "NewsletterBounceEvent"("newsletterId");

-- CreateIndex
CREATE INDEX "NewsletterBounceEvent_subscriberId_idx" ON "NewsletterBounceEvent"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterUnsubscribeEvent_newsletterId_idx" ON "NewsletterUnsubscribeEvent"("newsletterId");

-- CreateIndex
CREATE INDEX "NewsletterUnsubscribeEvent_subscriberId_idx" ON "NewsletterUnsubscribeEvent"("subscriberId");

-- AddForeignKey
ALTER TABLE "NewsletterOpenEvent" ADD CONSTRAINT "NewsletterOpenEvent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "NewsletterSend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterOpenEvent" ADD CONSTRAINT "NewsletterOpenEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterClickEvent" ADD CONSTRAINT "NewsletterClickEvent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "NewsletterSend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterClickEvent" ADD CONSTRAINT "NewsletterClickEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterBounceEvent" ADD CONSTRAINT "NewsletterBounceEvent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "NewsletterSend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterBounceEvent" ADD CONSTRAINT "NewsletterBounceEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterUnsubscribeEvent" ADD CONSTRAINT "NewsletterUnsubscribeEvent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "NewsletterSend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterUnsubscribeEvent" ADD CONSTRAINT "NewsletterUnsubscribeEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
