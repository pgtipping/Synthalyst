import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import React from "react";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.ttf" },
    { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: "#4F46E5", // indigo-600
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280", // gray-500
    marginBottom: 4,
  },
  section: {
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    color: "#4F46E5", // indigo-600
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
    marginTop: 12,
    color: "#6366F1", // indigo-500
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
    fontWeight: 700,
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
    fontWeight: 700,
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

  // Extract sections based on headings
  const sections: Section[] = [];
  const headingRegex = /(\d+\.\s+[^:]+):/g;
  let match;
  let lastIndex = 0;

  while ((match = headingRegex.exec(cleanContent)) !== null) {
    const heading = match[1];
    const startIndex = match.index;

    if (lastIndex > 0) {
      const sectionContent = cleanContent
        .substring(lastIndex, startIndex)
        .trim();
      sections.push({
        heading: sections[sections.length - 1]?.heading || "",
        content: sectionContent,
      });
    }

    sections.push({
      heading,
      content: "",
    });

    lastIndex = startIndex + match[0].length;
  }

  // Add the last section
  if (lastIndex > 0 && lastIndex < cleanContent.length) {
    const sectionContent = cleanContent.substring(lastIndex).trim();
    sections.push({
      heading: sections[sections.length - 1]?.heading || "",
      content: sectionContent,
    });
  }

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
              <Text style={styles.sectionTitle}>{section.heading}</Text>
              <Text style={styles.paragraph}>{section.content}</Text>
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
