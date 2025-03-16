export type EvidenceLevel = "high" | "moderate" | "low" | "very-low";

export interface StudyType {
  name: string;
  strength: number; // 1-10 scale
  description: string;
}

// Study types ordered by strength of evidence
export const STUDY_TYPES: Record<string, StudyType> = {
  META_ANALYSIS: {
    name: "Meta-analysis",
    strength: 10,
    description:
      "Statistical analysis that combines results of multiple studies",
  },
  SYSTEMATIC_REVIEW: {
    name: "Systematic Review",
    strength: 9,
    description: "Comprehensive summary of multiple research studies",
  },
  RCT: {
    name: "Randomized Controlled Trial",
    strength: 8,
    description: "Experimental study with random assignment to groups",
  },
  COHORT: {
    name: "Cohort Study",
    strength: 6,
    description: "Observational study following groups over time",
  },
  CASE_CONTROL: {
    name: "Case-Control Study",
    strength: 5,
    description:
      "Observational study comparing groups with and without an outcome",
  },
  CROSS_SECTIONAL: {
    name: "Cross-sectional Study",
    strength: 4,
    description: "Observational study at a single point in time",
  },
  CASE_SERIES: {
    name: "Case Series",
    strength: 3,
    description: "Report on multiple similar cases",
  },
  CASE_REPORT: {
    name: "Case Report",
    strength: 2,
    description: "Report on a single case",
  },
  EXPERT_OPINION: {
    name: "Expert Opinion",
    strength: 1,
    description: "Opinion of respected authorities",
  },
};

// Detect study type from title and abstract
export function detectStudyType(title: string, abstract: string): StudyType {
  const text = `${title} ${abstract}`.toLowerCase();

  if (text.includes("meta-analysis") || text.includes("meta analysis")) {
    return STUDY_TYPES.META_ANALYSIS;
  } else if (text.includes("systematic review")) {
    return STUDY_TYPES.SYSTEMATIC_REVIEW;
  } else if (
    (text.includes("randomized") || text.includes("randomised")) &&
    (text.includes("controlled trial") || text.includes("clinical trial"))
  ) {
    return STUDY_TYPES.RCT;
  } else if (
    text.includes("cohort study") ||
    text.includes("longitudinal study")
  ) {
    return STUDY_TYPES.COHORT;
  } else if (text.includes("case-control") || text.includes("case control")) {
    return STUDY_TYPES.CASE_CONTROL;
  } else if (
    text.includes("cross-sectional") ||
    text.includes("cross sectional")
  ) {
    return STUDY_TYPES.CROSS_SECTIONAL;
  } else if (text.includes("case series")) {
    return STUDY_TYPES.CASE_SERIES;
  } else if (text.includes("case report")) {
    return STUDY_TYPES.CASE_REPORT;
  } else {
    // Default to expert opinion if we can't determine
    return STUDY_TYPES.EXPERT_OPINION;
  }
}

// Determine overall evidence level based on available studies
export function determineEvidenceLevel(
  studies: Array<{
    title: string;
    abstract: string;
  }>
): EvidenceLevel {
  if (studies.length === 0) return "very-low";

  // Detect study types
  const studyTypes = studies.map((study) =>
    detectStudyType(study.title, study.abstract)
  );

  // Get the highest strength study
  const maxStrength = Math.max(...studyTypes.map((type) => type.strength));

  // Determine evidence level based on highest strength study
  if (maxStrength >= 9) return "high"; // Meta-analysis or systematic review
  if (maxStrength >= 7) return "moderate"; // RCT
  if (maxStrength >= 4) return "low"; // Observational studies
  return "very-low"; // Case reports, expert opinions
}
