import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4F46E5", // indigo-600
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4F46E5", // indigo-600
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
    color: "#6366F1", // indigo-500
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#4338CA", // indigo-700
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  list: {
    marginLeft: 10,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 4,
    flexDirection: "row",
  },
  listItemBullet: {
    width: 10,
  },
  listItemText: {
    flex: 1,
  },
  resourceSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4F46E5", // indigo-600
  },
  resource: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#F9FAFB", // gray-50
    borderRadius: 4,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  resourceName: {
    fontSize: 11,
    fontWeight: "bold",
  },
  resourceType: {
    fontSize: 9,
    color: "#6B7280", // gray-500
  },
  resourceAuthor: {
    fontSize: 9,
    color: "#6B7280", // gray-500
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#9CA3AF", // gray-400
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: "#9CA3AF", // gray-400
  },
  contentBlock: {
    marginBottom: 12,
  },
  moduleDetails: {
    marginLeft: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  duration: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#6B7280", // gray-500
    marginBottom: 6,
  },
  objectives: {
    fontSize: 11,
    marginBottom: 6,
  },
  objectivesTitle: {
    fontWeight: "bold",
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
                        <Text style={styles.objectives}>
                          <Text style={styles.objectivesTitle}>
                            Learning objectives:
                          </Text>
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
                        <Text style={styles.paragraph}>
                          <Text style={{ fontWeight: "bold" }}>
                            Content outline:
                          </Text>
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
