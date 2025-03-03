import { openRouter } from "@/lib/openrouter";

interface Resource {
  id: string;
  title: string;
  author?: string;
  type: "book" | "article" | "course" | "tool" | "community";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore: number;
}

interface PlanGenerationParams {
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

interface PlanResponse {
  text: string;
  model: string;
}

/**
 * Generates a training plan using Llama 3.2 3b
 */
export async function generatePlanWithLlama(
  data: PlanGenerationParams
): Promise<PlanResponse> {
  try {
    // Create a base prompt for all users
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
      
      Structure the plan with the following sections, using HTML formatting for better readability:
      
      <h2>1. Overview</h2>
      Provide a concise introduction to the training plan, explaining its purpose, scope, and expected outcomes. Mention the target audience and how the training aligns with their needs and career development.
      
      <h2>2. Learning Objectives</h2>
      List and elaborate on each learning objective, explaining why it's important and how it contributes to the overall goal of the training.
      
      <h2>3. Target Audience</h2>
      Describe the ideal participants for this training, including their background, experience level, and what they should expect to gain.
      
      <h2>4. Prerequisites</h2>
      Clearly state what knowledge, skills, or experience participants should have before starting this training.
      
      <h2>5. Training Structure</h2>
      Provide a high-level overview of how the training is organized, including the number of modules/sessions, their sequence, and the overall flow.
      
      <h2>6. Detailed Content</h2>
      For each module or session, include:
      <h3>Module 1: [Title]</h3>
      <ul>
        <li><strong>Duration:</strong> [Time]</li>
        <li><strong>Learning objectives:</strong> Specific outcomes for this module</li>
        <li><strong>Content outline:</strong> Key topics covered</li>
        <li><strong>Activities:</strong> Exercises, discussions, case studies</li>
        <li><strong>Resources:</strong> Materials needed for this module</li>
      </ul>
      
      <h2>7. Learning Activities</h2>
      Describe the various activities participants will engage in throughout the training, such as:
      <ul>
        <li>Hands-on exercises</li>
        <li>Group discussions</li>
        <li>Case studies</li>
        <li>Role-playing scenarios</li>
        <li>Practical applications</li>
      </ul>
      
      <h2>8. Assessment Methods</h2>
      Explain how learning will be evaluated, including:
      <ul>
        <li>Formative assessments during the training</li>
        <li>Summative assessments at the end</li>
        <li>Practical demonstrations of skills</li>
        <li>Projects or assignments</li>
        <li>Criteria for successful completion</li>
      </ul>
      
      <h2>9. Resources</h2>
      List recommended resources for participants, organized by type and relevance to specific learning objectives.
    `;

    // For premium users: Include Gemini resources
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
        
        When referencing these resources in your plan, mark them as "Premium Resource" to indicate they are specially curated resources.
        
        In the Resources section, organize these premium resources by:
        1. Relevance to specific learning objectives
        2. Type (books, courses, tools, etc.)
        3. Difficulty level
        
        For each resource, explain specifically how it supports particular learning objectives and why it's valuable.
      `;
    }
    // For free users: Enhanced prompt for better resource recommendations
    else {
      prompt += `
        
        Include a comprehensive resources section with:
        
        1. Books and publications:
           - Include author names and publication years
           - Prioritize respected authors and foundational texts
           - Include both beginner and advanced options
           - Focus on resources published within the last 3-5 years when possible
        
        2. Online courses and tutorials:
           - Include platform names (Coursera, Udemy, YouTube, etc.)
           - Specify if they're free or paid when possible
           - Include estimated completion time when relevant
           - Mention any certification opportunities
        
        3. Tools and software:
           - Specify which learning objectives they support
           - Include both free and commercial options
           - Note any special features relevant to the learning objectives
           - Mention system requirements if applicable
        
        4. Communities and forums:
           - Include online communities, forums, and discussion groups
           - Mention any regular meetups or conferences if applicable
           - Note which are most beginner-friendly
           - Highlight active communities with responsive moderators
        
        Organize resources by:
        1. Type (books, courses, tools, communities)
        2. Difficulty level (beginner, intermediate, advanced)
        3. Relevance to specific learning objectives
        
        For each resource, include a brief 1-2 sentence description explaining its specific value to the learner and which learning objectives it supports.
      `;
    }

    // Add formatting instructions
    prompt += `
      Format the plan in a clear, professional structure with proper HTML formatting:
      - Use <h2> for main section headings
      - Use <h3> for subsection headings
      - Use <ul> and <li> for lists
      - Use <p> for paragraphs
      - Use <strong> for emphasis
      - Use <table>, <tr>, <th>, and <td> for any tabular information
      
      Ensure the plan is comprehensive yet concise, focusing on practical, actionable content that will help participants achieve the stated learning objectives.
    `;

    // Call Llama API via OpenRouter
    const response = await openRouter.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert instructional designer and training plan creator with deep knowledge of adult learning principles, curriculum development, and professional training methodologies. Create detailed, well-structured training plans that follow best practices in education and professional development. Your plans should be practical, actionable, and focused on measurable learning outcomes.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3500,
    });

    // Extract the response text
    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Empty response from Llama");
    }

    return {
      text: responseText,
      model: "meta-llama/llama-3.2-3b-instruct",
    };
  } catch (error) {
    console.error("Error generating training plan with Llama:", error);
    throw error;
  }
}
