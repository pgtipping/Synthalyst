export interface JobDescription {
  id: string;
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  responsibilities: string[];
  requirements: {
    required: string[];
    preferred?: string[];
  };
  qualifications: {
    education?: string[];
    experience?: string[];
    skills: string[];
    certifications?: string[];
  };
  benefits?: string[];
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
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isTemplate: boolean;
    industry?: string;
    level?: string;
  };
}
