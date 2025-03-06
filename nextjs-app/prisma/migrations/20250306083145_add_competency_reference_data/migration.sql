/*
  Warnings:

  - You are about to drop the column `competencies` on the `CompetencyFramework` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CompetencyFramework` table. All the data in the column will be lost.
  - Added the required column `jobFunction` to the `CompetencyFramework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `CompetencyFramework` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleLevel` to the `CompetencyFramework` table without a default value. This is not possible if the table is not empty.
  - Made the column `industry` on table `CompetencyFramework` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CompetencyFramework" DROP COLUMN "competencies",
DROP COLUMN "title",
ADD COLUMN     "industryId" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobFunction" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "roleLevel" TEXT NOT NULL,
ALTER COLUMN "industry" SET NOT NULL;

-- CreateTable
CREATE TABLE "Competency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "businessImpact" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "industryId" TEXT,
    "source" TEXT,
    "sourceJdId" TEXT,

    CONSTRAINT "Competency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "levelOrder" INTEGER NOT NULL,
    "behavioralIndicators" TEXT[],
    "developmentSuggestions" TEXT[],
    "competencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetencyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetencyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobFamily" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jobFamilyId" TEXT NOT NULL,
    "jobLevelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyMatrix" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CompetencyMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatrixRole" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "matrixId" TEXT NOT NULL,
    "jobTitleId" TEXT,
    "jobLevelId" TEXT,

    CONSTRAINT "MatrixRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleCompetencyLevel" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "levelRequired" TEXT NOT NULL,

    CONSTRAINT "RoleCompetencyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobDescriptionToCompetency" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobDescriptionToCompetency_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Competency_frameworkId_idx" ON "Competency"("frameworkId");

-- CreateIndex
CREATE INDEX "Competency_categoryId_idx" ON "Competency"("categoryId");

-- CreateIndex
CREATE INDEX "Competency_industryId_idx" ON "Competency"("industryId");

-- CreateIndex
CREATE INDEX "CompetencyLevel_competencyId_idx" ON "CompetencyLevel"("competencyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyCategory_name_key" ON "CompetencyCategory"("name");

-- CreateIndex
CREATE INDEX "JobTitle_jobFamilyId_idx" ON "JobTitle"("jobFamilyId");

-- CreateIndex
CREATE INDEX "JobTitle_jobLevelId_idx" ON "JobTitle"("jobLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE INDEX "CompetencyMatrix_userId_idx" ON "CompetencyMatrix"("userId");

-- CreateIndex
CREATE INDEX "CompetencyMatrix_industryId_idx" ON "CompetencyMatrix"("industryId");

-- CreateIndex
CREATE INDEX "MatrixRole_matrixId_idx" ON "MatrixRole"("matrixId");

-- CreateIndex
CREATE INDEX "MatrixRole_jobTitleId_idx" ON "MatrixRole"("jobTitleId");

-- CreateIndex
CREATE INDEX "MatrixRole_jobLevelId_idx" ON "MatrixRole"("jobLevelId");

-- CreateIndex
CREATE INDEX "RoleCompetencyLevel_roleId_idx" ON "RoleCompetencyLevel"("roleId");

-- CreateIndex
CREATE INDEX "RoleCompetencyLevel_competencyId_idx" ON "RoleCompetencyLevel"("competencyId");

-- CreateIndex
CREATE INDEX "_JobDescriptionToCompetency_B_index" ON "_JobDescriptionToCompetency"("B");

-- CreateIndex
CREATE INDEX "CompetencyFramework_industryId_idx" ON "CompetencyFramework"("industryId");

-- AddForeignKey
ALTER TABLE "CompetencyFramework" ADD CONSTRAINT "CompetencyFramework_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CompetencyFramework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CompetencyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competency" ADD CONSTRAINT "Competency_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyLevel" ADD CONSTRAINT "CompetencyLevel_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_jobFamilyId_fkey" FOREIGN KEY ("jobFamilyId") REFERENCES "JobFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_jobLevelId_fkey" FOREIGN KEY ("jobLevelId") REFERENCES "JobLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyMatrix" ADD CONSTRAINT "CompetencyMatrix_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyMatrix" ADD CONSTRAINT "CompetencyMatrix_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrixRole" ADD CONSTRAINT "MatrixRole_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "CompetencyMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrixRole" ADD CONSTRAINT "MatrixRole_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrixRole" ADD CONSTRAINT "MatrixRole_jobLevelId_fkey" FOREIGN KEY ("jobLevelId") REFERENCES "JobLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleCompetencyLevel" ADD CONSTRAINT "RoleCompetencyLevel_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "MatrixRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleCompetencyLevel" ADD CONSTRAINT "RoleCompetencyLevel_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "Competency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobDescriptionToCompetency" ADD CONSTRAINT "_JobDescriptionToCompetency_A_fkey" FOREIGN KEY ("A") REFERENCES "Competency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobDescriptionToCompetency" ADD CONSTRAINT "_JobDescriptionToCompetency_B_fkey" FOREIGN KEY ("B") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
