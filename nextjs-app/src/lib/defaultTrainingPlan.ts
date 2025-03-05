// Define the interface for plan generation parameters
export interface PlanGenerationParams {
  title: string;
  description: string;
  objectives: string[];
  targetAudienceLevel: string;
  duration: string;
  prerequisites: string;
  learningStylePrimary: string;
  industry: string;
  materialsRequired: string[];
  certificationDetails: string;
  additionalNotes: string;
  isPremiumUser?: boolean;
  resources?: Resource[] | null;
}

export interface Resource {
  id: string;
  title: string;
  author?: string;
  type: "book" | "article" | "course" | "tool" | "community";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore: number;
}

/**
 * Generates a default training plan template based on the provided parameters
 * This is used as a fallback when all LLM services are unavailable
 */
export function generateDefaultTrainingPlan(
  data: PlanGenerationParams
): string {
  const {
    title,
    objectives,
    targetAudienceLevel,
    duration,
    prerequisites,
    learningStylePrimary,
    industry,
    materialsRequired,
    certificationDetails,
    additionalNotes,
  } = data;

  // Format objectives as HTML list items
  const objectivesList = objectives
    .map((obj: string) => `<li>${obj}</li>`)
    .join("\n");

  // Format materials as HTML list items if available
  const materialsList =
    materialsRequired && materialsRequired.length > 0
      ? materialsRequired
          .map((material: string) => `<li>${material}</li>`)
          .join("\n")
      : "<li>No specific materials required</li>";

  // Create a default training plan with the provided data
  return `
<div class="training-plan">
  <h1>${title}</h1>
  
  <h2>1. Overview</h2>
  <p>This training plan is designed to provide a structured approach to learning ${title}. 
  ${
    data.description
      ? data.description
      : `It focuses on key skills and knowledge required for ${
          industry || "the industry"
        }.`
  }
  This plan is suitable for ${targetAudienceLevel} level learners and is designed to be completed in ${duration}.</p>
  
  <h2>2. Learning Objectives</h2>
  <p>By the end of this training, participants will be able to:</p>
  <ul>
    ${objectivesList}
  </ul>
  
  <h2>3. Target Audience</h2>
  <p>This training is designed for ${targetAudienceLevel} level participants who are interested in ${
    industry || "this field"
  }. 
  ${
    prerequisites
      ? `Participants should have: ${prerequisites}`
      : "No specific prerequisites are required, but basic knowledge of the subject matter is helpful."
  }</p>
  
  <h2>4. Prerequisites</h2>
  <p>${
    prerequisites ||
    "No specific prerequisites are required for this training program. However, a basic understanding of the subject matter will be beneficial."
  }</p>
  
  <h2>5. Training Structure</h2>
  <p>This training is organized into modules that build upon each other, with a total duration of ${duration}. 
  Each module includes theoretical content, practical exercises, and assessments to ensure learning objectives are met.</p>
  
  <h2>6. Detailed Content</h2>
  
  <div class="module">
    <h3>Module 1: Introduction to ${title}</h3>
    <ul>
      <li><strong>Duration:</strong> ${
        duration.includes("days") ? "1 day" : "25% of total duration"
      }</li>
      <li><strong>Learning objectives:</strong> Understand the fundamentals and key concepts</li>
      <li><strong>Content outline:</strong> Overview, basic principles, terminology</li>
      <li><strong>Activities:</strong> Introductory exercises, group discussions</li>
      <li><strong>Resources:</strong> Foundational reading materials, introductory videos</li>
    </ul>
  </div>
  
  <div class="module">
    <h3>Module 2: Core Skills Development</h3>
    <ul>
      <li><strong>Duration:</strong> ${
        duration.includes("days") ? "2 days" : "50% of total duration"
      }</li>
      <li><strong>Learning objectives:</strong> Develop essential skills related to ${
        objectives[0] || title
      }</li>
      <li><strong>Content outline:</strong> Practical techniques, methodologies, best practices</li>
      <li><strong>Activities:</strong> Hands-on exercises, case studies, skill practice</li>
      <li><strong>Resources:</strong> Practical guides, tools, templates</li>
    </ul>
  </div>
  
  <div class="module">
    <h3>Module 3: Advanced Application</h3>
    <ul>
      <li><strong>Duration:</strong> ${
        duration.includes("days") ? "1 day" : "25% of total duration"
      }</li>
      <li><strong>Learning objectives:</strong> Apply knowledge in complex scenarios</li>
      <li><strong>Content outline:</strong> Advanced concepts, integration of skills, problem-solving</li>
      <li><strong>Activities:</strong> Complex projects, simulations, real-world applications</li>
      <li><strong>Resources:</strong> Advanced reference materials, expert insights</li>
    </ul>
  </div>
  
  <h2>7. Learning Activities</h2>
  <p>Participants will engage in a variety of activities designed to accommodate ${
    learningStylePrimary || "different"
  } learning styles:</p>
  <ul>
    <li>Interactive lectures and presentations</li>
    <li>Group discussions and collaborative problem-solving</li>
    <li>Hands-on exercises and practical applications</li>
    <li>Case studies and scenario-based learning</li>
    <li>Self-paced learning and reflection activities</li>
  </ul>
  
  <h2>8. Assessment Methods</h2>
  <p>Learning will be evaluated through:</p>
  <ul>
    <li>Formative assessments during each module</li>
    <li>Practical demonstrations of skills</li>
    <li>Project-based assessments</li>
    <li>Peer and self-evaluation</li>
    <li>Final comprehensive assessment</li>
  </ul>
  ${
    certificationDetails
      ? `<p>Certification details: ${certificationDetails}</p>`
      : ""
  }
  
  <h2>9. Resources</h2>
  <p>The following resources are recommended for this training:</p>
  <h3>Materials Required:</h3>
  <ul>
    ${materialsList}
  </ul>
  
  <h3>Recommended Reading:</h3>
  <ul>
    <li>Introduction to ${title} (Textbook)</li>
    <li>${title} Best Practices Guide</li>
    <li>Online resources and articles related to ${objectives[0] || title}</li>
  </ul>
  
  ${
    additionalNotes
      ? `<h2>10. Additional Notes</h2><p>${additionalNotes}</p>`
      : ""
  }
</div>
  `;
}
