import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
import React from "react";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    color: "#000000",
    fontSize: 12,
  },
  header: {
    marginBottom: 30,
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
  },
  resourceSection: {
    marginTop: 30,
    borderTop: "1 solid #cccccc",
    paddingTop: 20,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
  },
  resource: {
    marginBottom: 15,
    padding: 12,
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
  resourceList: {
    marginTop: 15,
  },
  resourceCategory: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#000000",
  },
});

// Custom CSS for HTML content
const htmlStyles = `
  body {
    font-family: Helvetica;
    font-size: 12px;
    line-height: 1.6;
    color: #000000;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: bold;
    color: #000000;
    page-break-after: avoid;
  }
  
  h1 {
    font-size: 20px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 8px;
  }
  
  h2 {
    font-size: 18px;
    margin-top: 25px;
  }
  
  h3 {
    font-size: 16px;
  }
  
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  
  ul, ol {
    margin-top: 10px;
    margin-bottom: 15px;
    padding-left: 25px;
  }
  
  li {
    margin-bottom: 6px;
  }
  
  .section-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 12px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 8px;
  }
  
  .section-content {
    margin-left: 8px;
    margin-bottom: 25px;
  }
  
  .duration {
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .objectives-title, .outline-title {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .module-details {
    margin-bottom: 20px;
    margin-left: 8px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
  }
  
  th {
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    font-weight: bold;
  }
  
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  /* Add page break controls */
  .page-break {
    page-break-after: always;
  }
  
  /* Ensure resources start on a new page if needed */
  .resources-section {
    page-break-before: auto;
  }
`;

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
  // Process resources to group them by type
  const resourcesByType: Record<string, Resource[]> = {};
  if (resources && resources.length > 0) {
    resources.forEach((resource) => {
      if (!resourcesByType[resource.type]) {
        resourcesByType[resource.type] = [];
      }
      resourcesByType[resource.type].push(resource);
    });
  }

  // Helper function to format resource type for display
  const formatResourceType = (type: string): string => {
    switch (type) {
      case "book":
        return "Books and Publications";
      case "course":
        return "Online Courses and Tutorials";
      case "tool":
        return "Tools and Software";
      case "community":
        return "Communities and Forums";
      case "video":
        return "Videos and Webinars";
      case "article":
        return "Articles and Guides";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1) + "s";
    }
  };

  // Prepare HTML content with proper styling
  const htmlContent = `
    <style>${htmlStyles}</style>
    <div>${content}</div>
  `;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.title}>{title}</Text>
          {createdAt && (
            <Text style={styles.subtitle}>
              Created on {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Html>{htmlContent}</Html>
        </View>

        {resources && resources.length > 0 && (
          <View style={styles.resourceSection} break>
            <Text style={styles.resourceTitle}>Recommended Resources</Text>
            <View style={styles.resourceList}>
              {Object.entries(resourcesByType).map(([type, typeResources]) => (
                <View key={type}>
                  <Text style={styles.resourceCategory}>
                    {formatResourceType(type)}
                  </Text>
                  {typeResources.map((resource) => (
                    <View
                      key={resource.id}
                      style={
                        resource.isPremium
                          ? [styles.resource, styles.premiumResource]
                          : styles.resource
                      }
                    >
                      <View style={styles.resourceHeader}>
                        <Text style={styles.resourceName}>
                          {resource.title}
                        </Text>
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
              ))}
            </View>
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
