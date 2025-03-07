/*
  Warnings:

  - Added the required column `llmImprovementSuggestion` to the `CompetencyFrameworkFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompetencyFrameworkFeedback" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "llmImprovementSuggestion" TEXT NOT NULL,
ADD COLUMN     "llmQualityFeedback" TEXT;
