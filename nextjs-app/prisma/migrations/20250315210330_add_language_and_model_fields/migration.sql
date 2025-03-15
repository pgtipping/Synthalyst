-- AlterTable
ALTER TABLE "KnowledgeEntry" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN     "modelUsed" TEXT;

-- AlterTable
ALTER TABLE "LearningContentEntry" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN     "modelUsed" TEXT;
