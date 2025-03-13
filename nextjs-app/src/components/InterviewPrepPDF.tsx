import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.4,
  },
  list: {
    marginLeft: 15,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
  },
  starSection: {
    marginBottom: 10,
  },
  starTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  metadata: {
    marginTop: 20,
    borderTop: "1 solid #ccc",
    paddingTop: 10,
  },
  metadataItem: {
    fontSize: 10,
    color: "#666",
    marginBottom: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

interface InterviewPrepPDFProps {
  jobTitle: string;
  company?: string;
  industry?: string;
  prepPlan: string;
  questions: string[];
}

export default function InterviewPrepPDF({
  jobTitle,
  company,
  industry,
  prepPlan,
  questions,
}: InterviewPrepPDFProps) {
  // Process the prep plan text to extract sections
  const processText = (text: string) => {
    // Split the text into lines
    const lines = text.split("\n");

    // Process the lines to identify sections, lists, etc.
    const processedLines = lines.map((line) => {
      // Check if it's a header (starts with #)
      if (line.startsWith("# ")) {
        return { type: "h1", content: line.substring(2) };
      } else if (line.startsWith("## ")) {
        return { type: "h2", content: line.substring(3) };
      } else if (line.startsWith("### ")) {
        return { type: "h3", content: line.substring(4) };
      }
      // Check if it's a list item
      else if (line.match(/^[\*\-] /)) {
        return { type: "listItem", content: line.substring(2) };
      } else if (line.match(/^\d+\. /)) {
        return {
          type: "numberedListItem",
          content: line.substring(line.indexOf(". ") + 2),
        };
      }
      // Check if it's a STAR format section
      else if (
        line.startsWith("* Situation:") ||
        line.startsWith("* Task:") ||
        line.startsWith("* Action:") ||
        line.startsWith("* Result:")
      ) {
        const [type, content] = line.substring(2).split(":");
        return { type: "starSection", starType: type, content: content.trim() };
      }
      // Check if it's a special section like "Leadership:"
      else if (
        line.match(/^\* (Leadership|HR Operations|Compensation & Benefits):/)
      ) {
        const [type, content] = line.substring(2).split(":");
        return {
          type: "specialSection",
          sectionType: type,
          content: content.trim(),
        };
      }
      // Otherwise, it's a paragraph
      else if (line.trim()) {
        return { type: "paragraph", content: line };
      }
      // Empty line
      else {
        return { type: "empty" };
      }
    });

    return processedLines;
  };

  const processedPlan = processText(prepPlan);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Interview Preparation Plan</Text>
          <Text style={styles.subtitle}>
            {jobTitle}
            {company && ` at ${company}`}
            {industry && ` • ${industry}`}
          </Text>
        </View>

        {/* Prep Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Plan</Text>

          {processedPlan.map((line, index) => {
            switch (line.type) {
              case "h1":
                return (
                  <Text
                    key={index}
                    style={[styles.sectionTitle, { marginTop: 10 }]}
                  >
                    {line.content}
                  </Text>
                );
              case "h2":
                return (
                  <Text key={index} style={styles.sectionSubtitle}>
                    {line.content}
                  </Text>
                );
              case "h3":
                return (
                  <Text key={index} style={styles.starTitle}>
                    {line.content}
                  </Text>
                );
              case "listItem":
              case "numberedListItem":
                return (
                  <Text key={index} style={styles.listItem}>
                    {line.type === "listItem" ? "• " : `${index + 1}. `}
                    {line.content}
                  </Text>
                );
              case "starSection":
                return (
                  <View key={index} style={styles.starSection}>
                    <Text style={styles.starTitle}>{line.starType}:</Text>
                    <Text style={styles.text}>{line.content}</Text>
                  </View>
                );
              case "specialSection":
                return (
                  <View key={index} style={styles.starSection}>
                    <Text style={styles.starTitle}>{line.sectionType}:</Text>
                    <Text style={styles.text}>{line.content}</Text>
                  </View>
                );
              case "paragraph":
                return (
                  <Text key={index} style={styles.text}>
                    {line.content}
                  </Text>
                );
              default:
                return null;
            }
          })}
        </View>

        {/* Practice Questions */}
        {questions.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Practice Questions</Text>
            <View style={styles.list}>
              {questions.map((question, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={[styles.listItem, { fontWeight: "bold" }]}>
                    Question {index + 1}:
                  </Text>
                  <Text style={styles.text}>{question}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by Synthalyst Interview Prep Tool •{" "}
          {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
