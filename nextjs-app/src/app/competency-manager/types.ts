export interface CompetencyLevel {
  id?: string;
  name: string;
  description: string;
  levelOrder: number;
  behavioralIndicators: string[];
  developmentSuggestions: string[];
  competencyId?: string;
}

export interface Competency {
  id?: string;
  name: string;
  description: string;
  businessImpact: string;
  type: string;
  levels: CompetencyLevel[];
  frameworkId?: string;
  categoryId?: string;
  industryId?: string;
}

export interface CompetencyFramework {
  id?: string;
  name: string;
  description: string;
  industry: string;
  jobFunction: string;
  roleLevel: string;
  competencies: Competency[];
  userId?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormData {
  industry: string;
  customIndustry: string;
  jobFunction: string;
  customJobFunction: string;
  roleLevel: string;
  customRoleLevel: string;
  numberOfCompetencies: number;
  competencyTypes: string[];
  customCompetencyType: string;
  numberOfLevels: number;
  specificRequirements: string;
  organizationalValues: string;
  existingCompetencies: string;
}

export interface IndustryCompetencySuggestion {
  industry: string;
  suggestions: {
    name: string;
    type: string;
    description: string;
  }[];
}
