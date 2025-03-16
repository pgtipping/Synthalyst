import axios from "axios";
import { parseAbstractsFromXml } from "./xml-parser";

// PubMed E-utilities API endpoints
const ESEARCH_URL =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const ESUMMARY_URL =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";
const EFETCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

// Get API key from environment variables
const API_KEY = process.env.PUBMED_API_KEY || "";

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  doi: string | null;
  abstract: string;
  url: string;
  citation: string;
}

export interface SearchOptions {
  maxResults?: number;
  minDate?: string; // YYYY/MM/DD
  maxDate?: string; // YYYY/MM/DD
  sort?: "relevance" | "pub_date";
}

export async function searchPubMed(
  query: string,
  options: SearchOptions = {}
): Promise<PubMedArticle[]> {
  const { maxResults = 5, minDate, maxDate, sort = "relevance" } = options;

  try {
    // Step 1: Search for article IDs
    const searchParams = new URLSearchParams({
      db: "pubmed",
      term: query,
      retmode: "json",
      retmax: maxResults.toString(),
      sort: sort === "relevance" ? "relevance" : "date",
      ...(API_KEY && { api_key: API_KEY }),
      ...(minDate && { mindate: minDate.replace(/-/g, "/") }),
      ...(maxDate && { maxdate: maxDate.replace(/-/g, "/") }),
    });

    const searchResponse = await axios.get(`${ESEARCH_URL}?${searchParams}`);
    const idList = searchResponse.data.esearchresult.idlist;

    if (!idList || idList.length === 0) {
      return [];
    }

    // Step 2: Get article summaries
    const summaryParams = new URLSearchParams({
      db: "pubmed",
      id: idList.join(","),
      retmode: "json",
      ...(API_KEY && { api_key: API_KEY }),
    });

    const summaryResponse = await axios.get(`${ESUMMARY_URL}?${summaryParams}`);
    const summaries = summaryResponse.data.result;

    // Step 3: Format the results
    const articles = idList.map((id) => {
      const article = summaries[id];
      return {
        pmid: id,
        title: article.title,
        authors: article.authors ? article.authors.map((a) => `${a.name}`) : [],
        journal: article.fulljournalname || article.source,
        publicationDate: article.pubdate,
        doi: article.elocationid
          ? article.elocationid.replace("doi: ", "")
          : null,
        abstract: "", // Will be populated in the next step
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        citation: formatCitation(article),
      };
    });

    // Step 4: Get abstracts for the articles
    if (articles.length > 0) {
      const abstractsData = await getAbstracts(idList);

      // Add abstracts to articles
      articles.forEach((article) => {
        article.abstract =
          abstractsData[article.pmid] || "Abstract not available";
      });
    }

    return articles;
  } catch (error) {
    console.error("PubMed search error:", error);
    return [];
  }
}

// Get full abstracts for articles
export async function getAbstracts(
  pmids: string[]
): Promise<Record<string, string>> {
  try {
    const params = new URLSearchParams({
      db: "pubmed",
      id: pmids.join(","),
      retmode: "xml",
      rettype: "abstract",
      ...(API_KEY && { api_key: API_KEY }),
    });

    const response = await axios.get(`${EFETCH_URL}?${params}`);
    // Parse XML response to extract abstracts
    const abstracts = await parseAbstractsFromXml(response.data);

    return abstracts;
  } catch (error) {
    console.error("Error fetching abstracts:", error);
    return {};
  }
}

// Helper function to format citations in a standard format
function formatCitation(article: any): string {
  const authors = article.authors
    ? article.authors
        .slice(0, 3)
        .map((a) => a.name)
        .join(", ") + (article.authors.length > 3 ? ", et al." : "")
    : "No authors listed";

  return `${authors}. ${article.title}. ${
    article.fulljournalname || article.source
  }. ${article.pubdate};${
    article.volume
      ? article.volume + (article.issue ? `(${article.issue})` : "") + ":"
      : ""
  }${article.pages || ""}.`;
}
