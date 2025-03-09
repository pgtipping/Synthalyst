import { NextRequest } from "next/server";
import {
  createHandler,
  successResponse,
  errorResponse,
} from "@/lib/api/handler";
import { getGeminiModel } from "@/lib/gemini";
import { z } from "zod";

// Define the valid categories
const VALID_CATEGORIES = [
  "Innovation & Tech",
  "Professional Growth",
  "Learning Lab",
  "Productivity & Tools",
  "Industry Insights",
  "Community Corner",
] as const;

// Create a type for the valid categories
type BlogCategory = (typeof VALID_CATEGORIES)[number];

// Check if a string is a valid category
const isValidCategory = (category: string): category is BlogCategory => {
  return VALID_CATEGORIES.includes(category as BlogCategory);
};

const generateBlogSchema = z.object({
  title: z.string().optional(),
  topic: z.string().optional(),
  category: z.string().optional(),
  targetAudience: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
});

type GenerateBlogInput = z.infer<typeof generateBlogSchema>;

// Category-specific guidance for the LLM
const CATEGORY_GUIDANCE: Record<BlogCategory, string> = {
  "Innovation & Tech": `
- Focus on practical applications of AI and emerging technologies
- Include specific examples of tools or technologies in action
- Discuss both benefits and potential challenges
- Consider ethical implications where relevant
- Include forward-looking predictions about technology evolution
`,
  "Professional Growth": `
- Provide actionable insights for career advancement
- Include strategies for skill development and professional improvement
- Consider different career stages and contexts
- Balance theoretical frameworks with practical implementation steps
- Address current workplace challenges and opportunities
`,
  "Learning Lab": `
- Focus on educational approaches, methodologies, and learning technologies
- Include insights on training methodologies and curriculum design
- Consider different learning contexts and preferences
- Reference current research in learning science
- Provide practical implementation steps for educators and learners
`,
  "Productivity & Tools": `
- Highlight specific tools and methodologies that enhance productivity
- Include step-by-step implementation guidance
- Consider different work contexts (remote, hybrid, office)
- Focus on measurable productivity improvements
- Address common productivity challenges and solutions
`,
  "Industry Insights": `
- Provide analysis and perspectives on industry trends and developments
- Include market analysis and trend forecasts
- Consider diverse industry contexts and challenges
- Reference current research and expert opinions
- Provide actionable insights for industry professionals
`,
  "Community Corner": `
- Highlight stories, contributions, and insights from the community
- Include user success stories and guest contributions
- Consider diverse community perspectives and experiences
- Focus on community building and engagement
- Provide opportunities for community participation and feedback
`,
};

export const POST = createHandler<GenerateBlogInput>(
  async (req: NextRequest, _params, body) => {
    if (!body) {
      return errorResponse("Request body is required", "BAD_REQUEST", 400);
    }

    try {
      const { title, topic, category, targetAudience, keyPoints } = body;

      // Get category-specific guidance
      let categoryGuidance = "";
      if (category && isValidCategory(category)) {
        categoryGuidance = `CATEGORY-SPECIFIC GUIDANCE (${category}):\n${CATEGORY_GUIDANCE[category]}\n`;
      }

      // Build the prompt based on the content creation guide
      const prompt = `
Create a high-quality blog post for The Synth Blog following these guidelines:

${title ? `Title: ${title}` : ""}
${topic ? `Topic: ${topic}` : ""}
${category ? `Category: ${category}` : ""}
${targetAudience ? `Target Audience: ${targetAudience}` : ""}
${
  keyPoints && keyPoints.length > 0
    ? `Key Points to Include: ${keyPoints.join(", ")}`
    : ""
}

${categoryGuidance}

CONTENT CREATION GUIDELINES:

Brand Voice & Tone:
- Forward-thinking and solution-oriented
- Authoritative yet approachable
- Evidence-based and practical
- Progressive and innovative
- Focuses on actionable insights

Content Structure:
1. Title Format:
   - Must be clear and specific
   - Should include actionable or valuable insight
   - Length: 40-60 characters

2. Introduction:
   - Start with a compelling hook
   - Establish relevance to reader's progress
   - Clear problem statement or opportunity identification
   - Preview of key insights

3. Main Body:
   - Minimum 3 key insights or takeaways
   - Each insight must be actionable, evidence-based, forward-looking, and progress-oriented
   - Include real-world examples or case studies
   - Link to relevant Synthalyst tools when applicable

4. Conclusion:
   - Actionable summary
   - Future implications
   - Call to action or next steps
   - Connection to relevant Synthalyst features or tools

Quality Checklist:
- Delivers clear, actionable value
- Aligns with "Insights That Power Progress" tagline
- Includes forward-looking perspectives
- Connects to broader industry trends
- References reliable sources
- Links to relevant Synthalyst tools/features
- Maintains professional yet accessible tone
- Includes practical implementation steps
- Encourages reader growth/progress

SEO & Metadata Requirements:
- Primary keyword in title
- 2-3 secondary keywords in subheadings
- Include relevant tags from category list
- Add internal links to related Synthalyst content

Content Enhancement:
- Include relevant statistics or data points
- Add visual elements (charts, infographics, diagrams)
- Use subheadings for easy scanning
- Include expert quotes when applicable
- Provide additional resources section

Please format the blog post in Markdown format.
`;

      // Get the Gemini model
      const model = getGeminiModel();

      // Generate the blog post
      const result = await model.generateContent(prompt);
      const blogContent = result.response.text();

      // Return the generated blog post
      return successResponse({
        content: blogContent,
        score: calculateGuidelineScore(blogContent),
        feedback: generateFeedback(blogContent),
      });
    } catch (error) {
      console.error("Error generating blog post:", error);
      return errorResponse(
        "Failed to generate blog post",
        "INTERNAL_SERVER_ERROR",
        500
      );
    }
  },
  {
    validationSchema: generateBlogSchema,
  }
);

// Function to calculate a score based on adherence to the content creation guide
function calculateGuidelineScore(content: string): number {
  let score = 0;
  const maxScore = 100;

  // Check for introduction
  if (content.includes("Introduction") || /^#+ Introduction/m.test(content)) {
    score += 10;
  }

  // Check for conclusion
  if (content.includes("Conclusion") || /^#+ Conclusion/m.test(content)) {
    score += 10;
  }

  // Check for headings (proper structure)
  const headingMatches = content.match(/^#+ .+$/gm);
  if (headingMatches && headingMatches.length >= 3) {
    score += 15;
  }

  // Check for actionable insights
  const actionableTerms = [
    "how to",
    "steps",
    "guide",
    "implement",
    "apply",
    "use",
    "create",
    "build",
    "develop",
    "start",
  ];
  const actionableCount = actionableTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  score += Math.min(actionableCount * 3, 15);

  // Check for evidence-based content
  const evidenceTerms = [
    "research",
    "study",
    "data",
    "statistics",
    "according to",
    "evidence",
    "survey",
    "report",
  ];
  const evidenceCount = evidenceTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  score += Math.min(evidenceCount * 3, 15);

  // Check for future-oriented content
  const futureTerms = [
    "future",
    "trend",
    "emerging",
    "upcoming",
    "next",
    "innovation",
    "evolving",
    "potential",
  ];
  const futureCount = futureTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  score += Math.min(futureCount * 3, 15);

  // Check for Synthalyst tool references
  if (content.toLowerCase().includes("synthalyst")) {
    score += 10;
  }

  // Check for length (comprehensive content)
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 1000) {
    score += 10;
  } else if (wordCount > 500) {
    score += 5;
  }

  return Math.min(score, maxScore);
}

// Function to generate feedback based on the content
function generateFeedback(content: string): string[] {
  const feedback: string[] = [];

  // Check for introduction
  if (!content.includes("Introduction") && !/^#+ Introduction/m.test(content)) {
    feedback.push("Add a clear introduction section with a compelling hook.");
  }

  // Check for conclusion
  if (!content.includes("Conclusion") && !/^#+ Conclusion/m.test(content)) {
    feedback.push(
      "Add a conclusion section with actionable summary and future implications."
    );
  }

  // Check for headings (proper structure)
  const headingMatches = content.match(/^#+ .+$/gm);
  if (!headingMatches || headingMatches.length < 3) {
    feedback.push(
      "Improve structure with more headings to organize content better."
    );
  }

  // Check for actionable insights
  const actionableTerms = [
    "how to",
    "steps",
    "guide",
    "implement",
    "apply",
    "use",
    "create",
    "build",
    "develop",
    "start",
  ];
  const actionableCount = actionableTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  if (actionableCount < 3) {
    feedback.push(
      "Include more actionable insights and practical implementation steps."
    );
  }

  // Check for evidence-based content
  const evidenceTerms = [
    "research",
    "study",
    "data",
    "statistics",
    "according to",
    "evidence",
    "survey",
    "report",
  ];
  const evidenceCount = evidenceTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  if (evidenceCount < 2) {
    feedback.push(
      "Add more evidence-based content with references to research or data."
    );
  }

  // Check for future-oriented content
  const futureTerms = [
    "future",
    "trend",
    "emerging",
    "upcoming",
    "next",
    "innovation",
    "evolving",
    "potential",
  ];
  const futureCount = futureTerms.filter((term) =>
    content.toLowerCase().includes(term)
  ).length;
  if (futureCount < 2) {
    feedback.push(
      "Include more forward-looking perspectives and future implications."
    );
  }

  // Check for Synthalyst tool references
  if (!content.toLowerCase().includes("synthalyst")) {
    feedback.push(
      "Add references to relevant Synthalyst tools or features to connect with the platform."
    );
  }

  // Check for length (comprehensive content)
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 500) {
    feedback.push(
      "Expand the content to be more comprehensive (aim for 1000+ words)."
    );
  }

  // If no issues found, provide positive feedback
  if (feedback.length === 0) {
    feedback.push(
      "Excellent work! Your content adheres well to the content creation guidelines."
    );
  }

  return feedback;
}
