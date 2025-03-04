import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
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
  sectionContent: {
    marginTop: 8,
    marginLeft: 5,
  },
  resourceList: {
    marginTop: 10,
  },
  resourceCategory: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#000000",
  },
});

// Custom CSS for HTML content
const htmlStyles = `
  body {
    font-family: Helvetica;
    font-size: 12px;
    line-height: 1.5;
    color: #000000;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: bold;
    color: #000000;
  }
  
  h1 {
    font-size: 18px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 5px;
  }
  
  h2 {
    font-size: 16px;
  }
  
  h3 {
    font-size: 14px;
  }
  
  p {
    margin-bottom: 8px;
  }
  
  ul, ol {
    margin-top: 8px;
    margin-bottom: 8px;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
  
  .section-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 5px;
  }
  
  .section-content {
    margin-left: 5px;
    margin-bottom: 20px;
  }
  
  .duration {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .objectives-title, .outline-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .module-details {
    margin-bottom: 15px;
    margin-left: 5px;
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
        <View style={styles.header}>
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
          <View style={styles.resourceSection}>
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
