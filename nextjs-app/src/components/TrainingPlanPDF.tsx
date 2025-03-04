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
    marginBottom: 15,
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
  },
  moduleDetails: {
    marginBottom: 10,
    marginLeft: 5,
  },
  contentBlock: {
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    marginBottom: 8,
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
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.4,
    color: "#000000",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
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
    lineHeight: 1.4,
  },
  resourceSection: {
    marginTop: 15,
    borderTop: "1 solid #cccccc",
    paddingTop: 10,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  resource: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f9f9f9",
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
  // Clean HTML content to extract text
  const cleanContent = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Extract sections based on numbered headings (e.g., "1. Overview", "2. Learning Objectives")
  const sections: Section[] = [];

  // Split content by main section numbers
  const mainSections = cleanContent.split(/(?=\d+\.\s+[A-Z])/);

  // Process each main section
  mainSections.forEach((section) => {
    if (!section.trim()) return;

    // Extract heading and content
    const match = section.match(/^(\d+\.\s*[^\.]+)(.*)/);
    if (match) {
      const [, heading, content] = match;

      // Check if this is a module section (e.g., "6. Detailed Content Module 1:")
      if (
        heading.includes("Detailed Content Module") ||
        heading.includes("Module")
      ) {
        // Process module content differently
        // Enhanced regex pattern to better handle variations in the module content format
        // - Makes the "Content outline:" part optional
        // - Handles cases where there might be additional subsections
        // - Improves capturing of learning objectives that might span multiple lines
        const moduleMatch = content.match(
          /Duration:\s*(.*?)(?:Learning objectives:|Learning Objectives:)\s*(.*?)(?=(?:Content outline:|Content Outline:|Additional Resources:|$))(.*)/i
        );

        if (moduleMatch) {
          const [, duration, objectives, contentOutline] = moduleMatch;

          // Process learning objectives to handle bullet points
          const processedObjectives = objectives
            .replace(/•/g, "- ") // Replace bullet points with dashes for consistency
            .replace(/\n+/g, " ") // Replace multiple newlines with a single space
            .trim();

          // Process content outline to handle nested content
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
                          Learning objectives:
                        </Text>
                        {/* Split objectives by bullet points or dashes and render as a list */}
                        {subsection.content
                          .split(/(?:- |\• )/)
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
                          Content outline:
                        </Text>
                        {/* Process content outline to handle potential structure */}
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
                // Render regular section content
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
              <View key={resource.id} style={styles.resource}>
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
