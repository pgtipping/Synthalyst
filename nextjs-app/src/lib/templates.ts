import crypto from "crypto";
import { prisma } from "./prisma";
import type { JobDescription, JobDescriptionDB } from "@/types/jobDescription";

interface TemplateData {
  title: string;
  department?: string;
  location?: string;
  employmentType: string;
  description: string;
  responsibilities: string[];
  requirements: {
    required: Array<{
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      description?: string;
    }>;
    preferred?: string[];
  };
  qualifications: {
    education?: string[];
    experience?: string[];
    certifications?: string[];
  };
  metadata: {
    industry: string;
    level: string;
    isTemplate: boolean;
    version?: number;
    contentHash?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface VersionResult {
  type: "version" | "unchanged";
  template: JobDescription;
}

interface DuplicateResult {
  type: "duplicate";
  canonical: JobDescription;
}

interface NewTemplateResult {
  type: "new";
  template: JobDescription;
}

type TemplateResult = VersionResult | DuplicateResult | NewTemplateResult;

const generateContentHash = (content: string): string => {
  return crypto.createHash("sha256").update(content).digest("hex");
};

export const parseJobDescription = (
  dbModel: JobDescriptionDB
): JobDescription => {
  const parsed = JSON.parse(dbModel.content);
  return {
    ...parsed,
    id: dbModel.id,
    metadata: {
      ...parsed.metadata,
      version: dbModel.version,
      isLatest: dbModel.isLatest,
      contentHash: dbModel.contentHash,
      parentId: dbModel.parentId,
      canonicalId: dbModel.canonicalId,
    },
  };
};

export const findDuplicateTemplate = async (
  contentHash: string,
  excludeId?: string
): Promise<JobDescription | null> => {
  const dbTemplate = await prisma.jobDescription.findFirst({
    where: {
      contentHash,
      id: excludeId ? { not: excludeId } : undefined,
      canonicalId: null,
      content: {
        contains: '"isTemplate":true',
      },
    },
  });

  return dbTemplate ? parseJobDescription(dbTemplate) : null;
};

export const handleDuplicateTemplate = async (
  template: JobDescriptionDB,
  canonicalTemplate: JobDescriptionDB
): Promise<JobDescription> => {
  const updated = await prisma.jobDescription.update({
    where: { id: template.id },
    data: {
      canonicalId: canonicalTemplate.id,
      isLatest: false,
    },
  });

  return parseJobDescription(updated);
};

export const createNewVersion = async (
  templateData: TemplateData,
  previousVersionId: string,
  userId: string
): Promise<VersionResult> => {
  const previousVersion = await prisma.jobDescription.findUnique({
    where: { id: previousVersionId },
  });

  if (!previousVersion) {
    throw new Error("Previous version not found");
  }

  const contentHash = generateContentHash(JSON.stringify(templateData));

  if (previousVersion.contentHash === contentHash) {
    return {
      type: "unchanged",
      template: parseJobDescription(previousVersion),
    };
  }

  await prisma.jobDescription.update({
    where: { id: previousVersionId },
    data: { isLatest: false },
  });

  const newVersion = await prisma.jobDescription.create({
    data: {
      title: templateData.title,
      content: JSON.stringify({
        ...templateData,
        metadata: {
          ...templateData.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: previousVersion.version + 1,
          isLatest: true,
          contentHash,
        },
      }),
      contentHash,
      version: previousVersion.version + 1,
      isLatest: true,
      parentId: previousVersionId,
      industry: templateData.metadata.industry,
      level: templateData.metadata.level,
      skills: templateData.requirements.required.map((skill) => skill.name),
      userId,
    },
  });

  return { type: "version", template: parseJobDescription(newVersion) };
};

export const createNewTemplate = async (
  templateData: TemplateData,
  userId: string
): Promise<TemplateResult> => {
  const contentHash = generateContentHash(JSON.stringify(templateData));

  const duplicate = await findDuplicateTemplate(contentHash);
  if (duplicate) {
    return { type: "duplicate", canonical: duplicate };
  }

  const template = await prisma.jobDescription.create({
    data: {
      title: templateData.title,
      content: JSON.stringify({
        ...templateData,
        metadata: {
          ...templateData.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
          isLatest: true,
          contentHash,
        },
      }),
      contentHash,
      version: 1,
      isLatest: true,
      industry: templateData.metadata.industry,
      level: templateData.metadata.level,
      skills: templateData.requirements.required.map((skill) => skill.name),
      userId,
    },
  });

  return { type: "new", template: parseJobDescription(template) };
};
