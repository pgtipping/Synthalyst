/*
  Warnings:

  - Added the required column `contentHash` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- Create function to generate content hash
CREATE OR REPLACE FUNCTION generate_content_hash(content TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(sha256(content::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Add contentHash column without NOT NULL constraint first
ALTER TABLE "JobDescription" 
    ADD COLUMN "contentHash" TEXT,
    ADD COLUMN "isLatest" BOOLEAN DEFAULT true,
    ADD COLUMN "parentId" TEXT,
    ADD COLUMN "version" INTEGER DEFAULT 1,
    ADD COLUMN "canonicalId" TEXT;

-- Update existing records with content hash
UPDATE "JobDescription"
SET "contentHash" = generate_content_hash(content);

-- Now make contentHash NOT NULL
ALTER TABLE "JobDescription" 
    ALTER COLUMN "contentHash" SET NOT NULL,
    ALTER COLUMN "isLatest" SET NOT NULL,
    ALTER COLUMN "version" SET NOT NULL;

-- Create indexes
CREATE INDEX "JobDescription_contentHash_idx" ON "JobDescription"("contentHash");
CREATE INDEX "JobDescription_parentId_idx" ON "JobDescription"("parentId");
CREATE INDEX "JobDescription_canonicalId_idx" ON "JobDescription"("canonicalId");

-- Add foreign key constraints
ALTER TABLE "JobDescription" 
    ADD CONSTRAINT "JobDescription_parentId_fkey" 
    FOREIGN KEY ("parentId") 
    REFERENCES "JobDescription"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "JobDescription" 
    ADD CONSTRAINT "JobDescription_canonicalId_fkey" 
    FOREIGN KEY ("canonicalId") 
    REFERENCES "JobDescription"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
