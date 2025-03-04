import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    color: "#000000", // Ensure all text is black by default
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444444",
  },
  section: {
    marginBottom: 20,
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    borderBottom: "1 solid #eeeeee",
    paddingBottom: 5,
  },
  moduleDetails: {
    marginBottom: 15,
    marginLeft: 5,
  },
  contentBlock: {
    marginBottom: 10,
  },
  duration: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  objectives: {
    fontSize: 12,
    marginBottom: 5,
    color: "#000000",
  },
  objectivesTitle: {
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
    color: "#000000",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 5,
  },
  listItemBullet: {
    width: 10,
    fontSize: 12,
    color: "#000000",
  },
  listItemText: {
    flex: 1,
    fontSize: 12,
    color: "#000000",
    lineHeight: 1.5,
  },
  resourceSection: {
    marginTop: 20,
    borderTop: "1 solid #cccccc",
    paddingTop: 15,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000000",
  },
  resource: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  resourceName: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    color: "#000000",
  },
  resourceType: {
    fontSize: 10,
    color: "#444444",
    textTransform: "uppercase",
  },
  resourceAuthor: {
    fontSize: 10,
    marginBottom: 5,
    fontStyle: "italic",
    color: "#444444",
  },
  resourceDescription: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#666666",
  },
  premiumResource: {
    backgroundColor: "#f0f7ff",
    borderLeft: "3 solid #3b82f6",
  },
});

interface Resource {
  id: string;
  title: string;
  author?: string;
  type:
    | "book"
    | "video"
    | "article"
    | "course"
    | "tool"
    | "community"
    | "other";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore?: number;
  isPremium?: boolean;
}

interface Section {
  heading: string;
  content: string;
  subsections?: Subsection[];
}

interface Subsection {
  title: string;
  content: string;
}

interface TrainingPlanPDFProps {
  title: string;
  content: string;
  resources?: Resource[];
  createdAt?: string;
}

export default function TrainingPlanPDF({
  title,
  content,
  resources,
  createdAt,
}: TrainingPlanPDFProps) {
  // Improved HTML content cleaning to better preserve structure
  const cleanContent = content
    .replace(/<div[^>]*>/g, "") // Remove div tags but keep content
    .replace(/<\/div>/g, "") // Remove closing div tags
    .replace(/<br\s*\/?>/g, "\n") // Convert <br> to newlines
    .replace(/<p[^>]*>(.*?)<\/p>/g, "$1\n\n") // Convert paragraphs to text with double newlines
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n") // Convert h1 to markdown-style heading
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n") // Convert h2 to markdown-style heading
    .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n") // Convert h3 to markdown-style heading
    .replace(/<h4[^>]*>(.*?)<\/h4>/g, "#### $1\n") // Convert h4 to markdown-style heading
    .replace(/<strong>(.*?)<\/strong>/g, "$1") // Keep text from strong tags
    .replace(/<em>(.*?)<\/em>/g, "$1") // Keep text from em tags
    .replace(/<ul[^>]*>|<\/ul>/g, "") // Remove ul tags
    .replace(/<ol[^>]*>|<\/ol>/g, "") // Remove ol tags
    .replace(/<li[^>]*>(.*?)<\/li>/g, "• $1\n") // Convert li to bullet points
    .replace(/<[^>]*>/g, " ") // Remove any remaining HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/\n\s+/g, "\n") // Clean up spaces after newlines
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ consecutive newlines with just 2
    .trim();

  // Extract sections based on numbered headings (e.g., "1. Overview", "2. Learning Objectives")
  const sections: Section[] = [];

  // Split content by main section numbers with improved regex
  const mainSections = cleanContent.split(/(?=\d+\.\s+[A-Z][a-z]+)/);

  // Process each main section
  mainSections.forEach((section) => {
    if (!section.trim()) return;

    // Extract heading and content with improved regex
    const match = section.match(/^(\d+\.\s*[^:\.]+)[:\.]?(.*)/);
    if (match) {
      const [, heading, content] = match;

      // Check if this is a module section (e.g., "6. Detailed Content Module 1:")
      if (
        heading.includes("Detailed Content Module") ||
        heading.includes("Module")
      ) {
        // Process module content with improved regex
        const moduleMatch = content.match(
          /Duration:\s*(.*?)(?:Learning objectives:|Learning Objectives:)\s*(.*?)(?=(?:Content outline:|Content Outline:|Additional Resources:|$))(.*)/i
        );

        if (moduleMatch) {
          const [, duration, objectives, contentOutline] = moduleMatch;

          // Process learning objectives with improved handling of bullet points
          const processedObjectives = objectives
            .replace(/•/g, "- ") // Replace bullet points with dashes for consistency
            .replace(/\n+/g, " ") // Replace multiple newlines with a single space
            .trim();

          // Process content outline with improved handling of structure
          const processedContentOutline = contentOutline
            ? contentOutline
                .replace(/Content outline:|Content Outline:/i, "") // Remove the heading
                .replace(/\n+/g, " ") // Replace multiple newlines with a single space
                .trim()
            : "";

          sections.push({
            heading: heading.trim(),
            content: "",
            subsections: [
              {
                title: "Duration",
                content: duration.trim(),
              },
              {
                title: "Learning objectives",
                content: processedObjectives,
              },
              {
                title: "Content outline",
                content: processedContentOutline,
              },
            ],
          });
        } else {
          // Fallback if the module content doesn't match the expected format
          sections.push({
            heading: heading.trim(),
            content: content.trim(),
          });
        }
      } else {
        // Regular section
        sections.push({
          heading: heading.trim(),
          content: content.trim(),
        });
      }
    } else {
      // If no heading pattern found, add as raw content
      sections.push({
        heading: "",
        content: section.trim(),
      });
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {createdAt && (
            <Text style={styles.subtitle}>
              Created on {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        {sections.length > 0 ? (
          sections.map((section, index) => (
            <View key={index} style={styles.section}>
              {section.heading && (
                <Text style={styles.sectionTitle}>{section.heading}</Text>
              )}

              {section.subsections ? (
                // Render module content with subsections
                section.subsections.map((subsection, subIndex) => (
                  <View
                    key={`${index}-${subIndex}`}
                    style={styles.moduleDetails}
                  >
                    {subsection.title === "Duration" ? (
                      <Text style={styles.duration}>{subsection.content}</Text>
                    ) : subsection.title === "Learning objectives" ? (
                      <View style={styles.contentBlock}>
                        <Text style={styles.objectivesTitle}>
                          Learning Objectives:
                        </Text>
                        {/* Split objectives by bullet points or dashes with improved regex */}
                        {subsection.content
                          .split(/(?:- |\• |\d+\.\s+)/)
                          .filter(Boolean)
                          .map((objective, i) => (
                            <View key={i} style={styles.listItem}>
                              <Text style={styles.listItemBullet}>•</Text>
                              <Text style={styles.listItemText}>
                                {objective.trim()}
                              </Text>
                            </View>
                          ))}
                      </View>
                    ) : (
                      <View style={styles.contentBlock}>
                        <Text style={styles.objectivesTitle}>
                          Content Outline:
                        </Text>
                        {/* Process content outline with improved regex for structure */}
                        {subsection.content
                          .split(/(?:\d+\.\s+|\-\s+|\•\s+)/)
                          .filter(Boolean)
                          .map((item, i) => (
                            <View
                              key={i}
                              style={[styles.listItem, { marginTop: 2 }]}
                            >
                              <Text style={styles.listItemBullet}>•</Text>
                              <Text style={styles.listItemText}>
                                {item.trim()}
                              </Text>
                            </View>
                          ))}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                // Render regular section content with improved paragraph handling
                <Text style={styles.paragraph}>{section.content}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.paragraph}>{cleanContent}</Text>
        )}

        {resources && resources.length > 0 && (
          <View style={styles.resourceSection}>
            <Text style={styles.resourceTitle}>Recommended Resources</Text>
            {resources.map((resource) => (
              <View
                key={resource.id}
                style={
                  resource.isPremium
                    ? [styles.resource, styles.premiumResource]
                    : styles.resource
                }
              >
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceName}>{resource.title}</Text>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                </View>
                {resource.author && (
                  <Text style={styles.resourceAuthor}>
                    By {resource.author}
                  </Text>
                )}
                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Generated with Synthalyst Training Plan Creator | Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
