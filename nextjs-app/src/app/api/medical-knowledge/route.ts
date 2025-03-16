import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchPubMed, PubMedArticle } from "@/lib/medical/pubmed-client";
import {
  determineEvidenceLevel,
  EvidenceLevel,
} from "@/lib/medical/evidence-grading";
import { generateContentV2 } from "@/lib/ai/model-router";

export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 5, requireRecent = true } = await req.json();

    // Optional: Check authentication for premium features
    const session = await getServerSession(authOptions);
    const isPremium = !!session?.user;

    // Search PubMed
    const searchOptions = {
      maxResults: isPremium ? maxResults : 3, // Limit for non-premium users
      minDate: requireRecent ? "2020/01/01" : undefined, // Only recent studies for medical accuracy
      sort: "relevance",
    };

    const articles = await searchPubMed(query, searchOptions);

    // Determine evidence level
    const evidenceLevel = determineEvidenceLevel(
      articles.map((article) => ({
        title: article.title,
        abstract: article.abstract,
      }))
    );

    // Create a medical-specific prompt
    const systemPrompt = `You are a medical knowledge assistant providing evidence-based information. 
    
    IMPORTANT GUIDELINES:
    - Base your answers on peer-reviewed medical literature
    - Clearly distinguish between established medical facts and emerging research
    - Include proper citations for all medical claims using the format [1], [2], etc.
    - Use accessible language while maintaining medical accuracy
    - Include a disclaimer that this is not medical advice
    
    The following are relevant medical articles from PubMed related to the query:
    
    ${articles
      .map(
        (article, index) => `
    [${index + 1}] ${article.title}
    Authors: ${article.authors.join(", ")}
    Journal: ${article.journal} (${article.publicationDate})
    Abstract: ${article.abstract.substring(0, 300)}${
          article.abstract.length > 300 ? "..." : ""
        }
    PMID: ${article.pmid}
    `
      )
      .join("\n\n")}
    
    Evidence level: ${evidenceLevel.toUpperCase()}
    
    Based on these articles and your medical knowledge, please answer the following question:
    ${query}
    
    Include relevant citations in your answer using the format [1], [2], etc.
    End with a disclaimer that this information does not constitute medical advice.`;

    // Generate response using your existing AI infrastructure
    const response = await generateContentV2({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      type: "knowledge",
      temperature: 0.3, // Lower temperature for medical accuracy
      maxTokens: 1500,
    });

    return NextResponse.json({
      content: response,
      sources: articles.map((a) => ({
        title: a.title,
        authors: a.authors,
        journal: a.journal,
        date: a.publicationDate,
        url: a.url,
        pmid: a.pmid,
      })),
      evidenceLevel,
    });
  } catch (error) {
    console.error("Medical knowledge API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve medical information" },
      { status: 500 }
    );
  }
}
