-- AlterTable
ALTER TABLE "CompetencyFramework" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "feedbackCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CompetencyFrameworkFeedback" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetencyFrameworkFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompetencyFrameworkFeedback_frameworkId_idx" ON "CompetencyFrameworkFeedback"("frameworkId");

-- CreateIndex
CREATE INDEX "CompetencyFrameworkFeedback_userId_idx" ON "CompetencyFrameworkFeedback"("userId");

-- AddForeignKey
ALTER TABLE "CompetencyFrameworkFeedback" ADD CONSTRAINT "CompetencyFrameworkFeedback_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFrameworkFeedback" ADD CONSTRAINT "CompetencyFrameworkFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
