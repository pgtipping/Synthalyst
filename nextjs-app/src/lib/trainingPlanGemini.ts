import { PlanGenerationParams } from "./defaultTrainingPlan";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PlanResponse {
  text: string;
}

/**
 * Creates a prompt for the Gemini model based on the provided parameters
 */
function createGeminiPrompt(data: PlanGenerationParams): string {
  let prompt = `
    Create a detailed, professional training plan based on:
    
    Title: ${data.title}
    ${data.description ? `Description: ${data.description}` : ""}
    Learning Objectives: 
    ${data.objectives.map((obj) => `- ${obj}`).join("\n")}
    
    Target Audience Level: ${data.targetAudienceLevel}
    Duration: ${data.duration}
    ${data.prerequisites ? `Prerequisites: ${data.prerequisites}` : ""}
    ${
      data.learningStylePrimary
        ? `Learning Style: ${data.learningStylePrimary}`
        : ""
    }
    ${data.industry ? `Industry/Domain: ${data.industry}` : ""}
    ${
      data.materialsRequired.length > 0
        ? `Materials Required: ${data.materialsRequired.join(", ")}`
        : ""
    }
    ${
      data.certificationDetails
        ? `Certification Details: ${data.certificationDetails}`
        : ""
    }
    ${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}` : ""}
    
    Structure the plan with the following sections, using clean HTML formatting for better readability:
    
    <div class="training-plan">
      <h1>${data.title}</h1>
      
      <h2>1. Overview</h2>
      <p>Provide a concise introduction to the training plan, explaining its purpose, scope, and expected outcomes. Mention the target audience and how the training aligns with their needs and career development.</p>
      
      <h2>2. Learning Objectives</h2>
      <p>List and elaborate on each learning objective, explaining why it's important and how it contributes to the overall goal of the training.</p>
      
      <h2>3. Target Audience</h2>
      <p>Describe the ideal participants for this training, including their background, experience level, and what they should expect to gain.</p>
      
      <h2>4. Prerequisites</h2>
      <p>Clearly state what knowledge, skills, or experience participants should have before starting this training.</p>
      
      <h2>5. Training Structure</h2>
      <p>Provide a high-level overview of how the training is organized, including the number of modules/sessions, their sequence, and the overall flow.</p>
      
      <h2>6. Detailed Content</h2>
      <p>For each module or session, include:</p>
      <div class="module">
        <h3>Module 1: [Title]</h3>
        <ul>
          <li><strong>Duration:</strong> [Time]</li>
          <li><strong>Learning objectives:</strong> Specific outcomes for this module</li>
          <li><strong>Content outline:</strong> Key topics covered</li>
          <li><strong>Activities:</strong> Exercises, discussions, case studies</li>
          <li><strong>Resources:</strong> Materials needed for this module</li>
        </ul>
      </div>
      
      <h2>7. Learning Activities</h2>
      <p>Describe the various activities participants will engage in throughout the training, such as:</p>
      <ul>
        <li>Hands-on exercises</li>
        <li>Group discussions</li>
        <li>Case studies</li>
        <li>Role-playing scenarios</li>
        <li>Practical applications</li>
      </ul>
      
      <h2>8. Assessment Methods</h2>
      <p>Explain how learning will be evaluated, including:</p>
      <ul>
        <li>Formative assessments during the training</li>
        <li>Summative assessments at the end</li>
        <li>Practical demonstrations of skills</li>
        <li>Projects or assignments</li>
        <li>Criteria for successful completion</li>
      </ul>
      
      <h2>9. Resources</h2>
      <p>List recommended resources for participants, organized by type and relevance to specific learning objectives.</p>
    </div>
  `;

  // For premium users: Include resources
  if (data.isPremiumUser && data.resources && data.resources.length > 0) {
    prompt += `
      
      Incorporate these current, AI-curated resources where appropriate in your plan:
      
      ${data.resources
        .map((resource) => {
          return `
        - ${resource.title}${resource.author ? ` by ${resource.author}` : ""}
          Type: ${resource.type}
          ${
            resource.publicationDate
              ? `Published: ${resource.publicationDate}`
              : ""
          }
          ${resource.url ? `URL: ${resource.url}` : ""}
          Description: ${resource.description}
        `;
        })
        .join("\n")}
      
      When referencing these resources in your plan, use the following format:
      
      <div class="premium-resource">
        <h4>Premium Resource: [Resource Title]</h4>
        <p><strong>Type:</strong> [Resource Type]</p>
        <p><strong>Author:</strong> [Author Name]</p>
        <p><strong>Description:</strong> [Resource Description]</p>
        <p><a href="[Resource URL]" target="_blank">Access Resource</a></p>
      </div>
    `;
  }

  return prompt;
}

/**
 * Generates a training plan using Google's Gemini 2.0 Flash model
 */
export async function generatePlanWithGemini(
  data: PlanGenerationParams
): Promise<PlanResponse> {
  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create the prompt
  const prompt = createGeminiPrompt(data);

  // Generate the training plan
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Return the generated plan
  return {
    text,
  };
}
