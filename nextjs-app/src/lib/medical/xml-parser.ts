import { parseString } from "xml2js";

export function parseAbstractsFromXml(
  xml: string
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const abstracts: Record<string, string> = {};

        // Navigate the XML structure to find abstracts
        const articles = result.PubmedArticleSet?.PubmedArticle || [];

        articles.forEach((article) => {
          const pmid = article.MedlineCitation?.[0]?.PMID?.[0]?._;
          if (!pmid) return;

          const abstractTexts =
            article.MedlineCitation?.[0]?.Article?.[0]?.Abstract?.[0]
              ?.AbstractText || [];

          // Some abstracts have labeled sections
          let abstractText = "";

          abstractTexts.forEach((text) => {
            // Check if the abstract has labeled sections
            const label = text?.$?.Label;
            const content = text?._ || text;

            if (label) {
              abstractText += `${label}: ${content} `;
            } else {
              abstractText += `${content} `;
            }
          });

          if (abstractText) {
            abstracts[pmid] = abstractText.trim();
          }
        });

        resolve(abstracts);
      } catch (error) {
        console.error("Error parsing XML:", error);
        reject(error);
      }
    });
  });
}
