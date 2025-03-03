export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: {
    level: string;
    prerequisites?: string[];
    idealFor?: string[];
  };
  duration: {
    total: string;
    breakdown?: {
      sections: number;
      hoursPerSection?: number;
      weeksToComplete?: number;
    };
  };
  content: {
    sections: {
      id: string;
      title: string;
      description: string;
      topics: string[];
      activities?: {
        type: string;
        description: string;
        duration: string;
        materials?: string[];
      }[];
      resources?: {
        type: string;
        title: string;
        url?: string;
        description?: string;
      }[];
      assessments?: {
        type: string;
        description: string;
        criteria?: string[];
      }[];
    }[];
  };
  learningStyle: {
    primary: string;
    methods: string[];
    ratio?: {
      theory: number;
      practical: number;
    };
  };
  materials?: {
    required: string[];
    optional?: string[];
    provided?: string[];
  };
  certification?: {
    type: string;
    requirements: string[];
    validityPeriod?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isTemplate: boolean;
    industry?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    version?: string;
    premiumResources?: boolean;
  };
}
