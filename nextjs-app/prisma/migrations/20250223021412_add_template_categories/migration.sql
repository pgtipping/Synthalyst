-- CreateTable
CREATE TABLE "TemplateCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#94a3b8',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobDescriptionToTemplateCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobDescriptionToTemplateCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateCategory_name_key" ON "TemplateCategory"("name");

-- CreateIndex
CREATE INDEX "_JobDescriptionToTemplateCategory_B_index" ON "_JobDescriptionToTemplateCategory"("B");

-- AddForeignKey
ALTER TABLE "_JobDescriptionToTemplateCategory" ADD CONSTRAINT "_JobDescriptionToTemplateCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobDescriptionToTemplateCategory" ADD CONSTRAINT "_JobDescriptionToTemplateCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "TemplateCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
