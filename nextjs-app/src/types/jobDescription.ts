// API Model
export interface JobDescription {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  responsibilities: string[];
  requirements: {
    required: {
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      description: string;
    }[];
    preferred?: {
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      description: string;
    }[];
  };
  qualifications: {
    education: string[] | null;
    experience: string[] | null;
    certifications: string[] | null;
  };
  salary?: {
    range?: {
      min: number;
      max: number;
    };
    type: "hourly" | "monthly" | "yearly";
    currency?: string;
  };
  company?: {
    name?: string;
    description?: string;
    culture?: string[];
  };
  benefits?: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isTemplate: boolean;
    industry?: string;
    level?: string;
    version: number;
    isLatest: boolean;
    contentHash: string;
    parentId?: string;
    canonicalId?: string;
  };
  versions?: JobDescription[];
}

// Database Model
export interface JobDescriptionDB {
  id: string;
  title: string;
  content: string;
  industry: string | null;
  level: string | null;
  skills: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isLatest: boolean;
  contentHash: string;
  parentId: string | null;
  canonicalId: string | null;
}
