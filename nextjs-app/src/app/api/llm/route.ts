import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, type } = body;

    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      );
    }

    // Get the model - using Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // Prepare system prompt based on type
    let systemPrompt = "";
    switch (type) {
      case "generate":
        systemPrompt = `You are a professional blog post writer. 
        Create engaging, valuable content following these guidelines:
        - Style: Forward-thinking, approachable, practical, evidence-based, and positive
        - Structure: Catchy title, engaging introduction, valuable main content (3-5 sections), memorable conclusion
        - Include actionable advice and real examples
        - Back up claims with data when possible
        - Focus on solutions and opportunities
        - Place the person before the action in sentences
        - Keep writing simple and persuasive
        - Remove extra words and prune sentences for clarity
        - Use active voice whenever possible
        
        SEO Optimization:
        - Include relevant keywords naturally throughout the content
        - Create descriptive, keyword-rich headings
        - Ensure proper heading hierarchy (H1 > H2 > H3)
        - Write meta-friendly content (compelling title and introduction)
        - Include internal linking opportunities where relevant
        - Aim for content length of 1000-1500 words for optimal SEO
        
        Important formatting rules:
        1. Output clean HTML without any markdown or code fences
        2. Use semantic HTML elements: <h1> for title, <h2> for sections, <p> for paragraphs
        3. Do not mention or reference our company name in the content
        4. Keep the content brand-neutral and focused on value
        
        Based on this prompt, generate a blog post: ${prompt}`;
        break;
      case "improve":
        systemPrompt = `You are a professional blog post editor.
        Review the following content and provide specific suggestions for improvement based on these guidelines:
        - Style: Forward-thinking, approachable, practical, evidence-based, and positive
        - Structure: Check title, introduction, main content sections, and conclusion
        - Look for opportunities to add actionable advice and examples
        - Suggest ways to back up claims with data
        - Ensure focus on solutions and opportunities
        - Check if sentences place the person before the action
        - Identify opportunities to simplify and make writing more persuasive
        - Find and remove extra words and overly complex sentences
        - Convert passive voice to active voice where appropriate
        
        Format your response in these sections:
        <h2>Overall Assessment</h2>
        <p>[Your assessment here]</p>
        
        <h2>Specific Suggestions</h2>
        <ul>
          <li>[Each suggestion with example]</li>
        </ul>
        
        <h2>Proposed Improvements</h2>
        <p>[Detailed improvements]</p>
        
        Content to review: ${prompt}`;
        break;
      case "seo_optimize":
        systemPrompt = `You are an SEO expert specializing in blog content optimization.
        Analyze the following content and provide specific SEO improvements:
        
        SEO Analysis Focus Areas:
        - Keyword usage and placement
        - Title optimization
        - Meta description suggestions
        - Heading structure and hierarchy
        - Content length and depth
        - Internal linking opportunities
        - Readability improvements
        - Mobile optimization considerations
        
        Format your response in these sections:
        <h2>SEO Assessment</h2>
        <p>[Your overall SEO assessment]</p>
        
        <h2>Keyword Analysis</h2>
        <ul>
          <li>Primary keyword suggestion: [keyword]</li>
          <li>Secondary keywords: [keyword list]</li>
          <li>Long-tail keyword opportunities: [keyword list]</li>
        </ul>
        
        <h2>Title & Meta Optimization</h2>
        <p>Optimized title suggestion: [title]</p>
        <p>Meta description suggestion: [meta description under 160 characters]</p>
        
        <h2>Content Structure Improvements</h2>
        <ul>
          <li>[Each suggestion with example]</li>
        </ul>
        
        <h2>Additional SEO Recommendations</h2>
        <ul>
          <li>[Each recommendation]</li>
        </ul>
        
        Content to analyze: ${prompt}`;
        break;
      case "suggest_tags":
        systemPrompt = `You are a content categorization expert.
        Based on the following blog post content, suggest relevant categories and tags.
        Categories should be from: Innovation & Tech, Professional Growth, Learning Lab, Productivity & Tools, Industry Insights, Community Corner
        Tags should be specific keywords that help readers find this content.
        
        Format your response in clean HTML:
        <h2>Categories</h2>
        <ul>
          <li>[Category 1]</li>
          <li>[Category 2]</li>
        </ul>
        
        <h2>Tags</h2>
        <ul>
          <li>[Tag 1]</li>
          <li>[Tag 2]</li>
        </ul>
        
        Content to analyze: ${prompt}`;
        break;
      case "open_question":
        systemPrompt = `You are a professional blog writing assistant with expertise in content creation, SEO, and digital marketing.
        
        Answer the following question about blog writing, providing practical, actionable advice tailored to the user's specific needs.
        
        Writing Style Guidelines to Incorporate in Your Advice:
        - Place the person before the action in sentences
        - Keep writing simple and persuasive
        - Remove extra words and prune sentences for clarity
        - Use active voice whenever possible
        - Create engaging, scannable content
        - Maintain a conversational yet professional tone
        
        SEO Best Practices to Include When Relevant:
        - Strategic keyword placement
        - Proper heading hierarchy
        - Optimal content length
        - Internal and external linking strategies
        - Meta description optimization
        - Mobile-friendly content structure
        
        Important formatting rules:
        1. Output clean HTML without any markdown or code fences
        2. Use semantic HTML elements: <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul>/<li> for lists
        3. Keep responses concise but comprehensive
        4. Include specific examples where appropriate
        5. Provide actionable next steps
        6. Do not mention or reference our company name in the content
        7. Keep the content brand-neutral and focused on value
        
        User question: ${prompt}
        
        If the question is about creating an excerpt, provide a specific formula and examples for creating compelling excerpts that drive clicks.`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type specified" },
          { status: 400 }
        );
    }

    // Generate content with streaming
    const result = await model.generateContentStream(systemPrompt);

    // Create a new ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            // Clean up any potential markdown or code fences
            const cleanText = text
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();
            controller.enqueue(cleanText);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("LLM API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
