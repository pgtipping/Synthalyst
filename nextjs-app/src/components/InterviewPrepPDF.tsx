import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #4F46E5",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#4F46E5",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4F46E5",
    paddingBottom: 2,
    borderBottom: "0.5 solid #E5E7EB",
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
    color: "#4F46E5",
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#6366F1",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
    color: "#374151",
  },
  list: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.4,
    textIndent: -10,
    paddingLeft: 10,
  },
  starSection: {
    marginBottom: 12,
    marginLeft: 10,
    borderLeft: "1 solid #E5E7EB",
    paddingLeft: 8,
  },
  starTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#4F46E5",
  },
  phaseSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 4,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 5,
  },
  categorySection: {
    marginTop: 8,
    marginBottom: 8,
    borderLeft: "2 solid #E5E7EB",
    paddingLeft: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6366F1",
    marginBottom: 3,
  },
  stepSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 4,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 5,
  },
  metadata: {
    marginTop: 20,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 10,
  },
  metadataItem: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6B7280",
    borderTop: "0.5 solid #E5E7EB",
    paddingTop: 5,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 3,
  },
  questionText: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
    color: "#374151",
  },
  questionContainer: {
    marginBottom: 15,
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
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
    // Clean up the text
    const cleanText = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

    // Split the text into lines
    const lines = cleanText.split("\n");

    // Process the lines to identify sections, lists, etc.
    const processedLines = lines.map((line) => {
      // Remove any markdown bold/italic markers
      const cleanLine = line
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*([^*]+?)\*/g, "$1");

      // Check if it's a main header (starts with # or is INTERVIEW PREPARATION PLAN)
      if (
        cleanLine.startsWith("# ") ||
        /^INTERVIEW PREPARATION PLAN/i.test(cleanLine)
      ) {
        return {
          type: "h1",
          content: cleanLine.startsWith("# ")
            ? cleanLine.substring(2)
            : cleanLine,
        };
      }
      // Check if it's a section header
      else if (cleanLine.startsWith("## ")) {
        return { type: "h2", content: cleanLine.substring(3) };
      }
      // Check if it's a subsection header
      else if (cleanLine.startsWith("### ")) {
        return { type: "h3", content: cleanLine.substring(4) };
      }
      // Check if it's a phase header (Research Phase, Practice Phase, etc.)
      else if (
        /^(Research Phase|Practice Phase|Day Before Preparation|Interview Day|Follow-up)( \(\d+-\d+ days before\))?:/.test(
          cleanLine
        )
      ) {
        const match = cleanLine.match(/^([^:]+):(.*)/);
        if (match) {
          return {
            type: "phase",
            phaseType: match[1],
            content: match[2].trim(),
          };
        }
      }
      // Check if it's a step (Step 1:, Step 2:, etc.)
      else if (/^(\* )?(Step \d+: .+?):/.test(cleanLine)) {
        const match = cleanLine.match(/^(\* )?(Step \d+: .+?):(.*)/);
        if (match) {
          return {
            type: "step",
            stepType: match[2],
            content: match[3].trim(),
          };
        }
      }
      // Check if it's a STAR format section
      else if (/^(\* )?(Situation|Task|Action|Result):/.test(cleanLine)) {
        const match = cleanLine.match(/^(\* )?([^:]+):(.*)/);
        if (match) {
          return {
            type: "starSection",
            starType: match[2],
            content: match[3].trim(),
          };
        }
      }
      // Check if it's a special category section
      else if (
        /^(\* )?(Leadership|HR Operations|Compensation & Benefits|Technical Skills|Communication|Problem Solving|Cultural Fit):/.test(
          cleanLine
        )
      ) {
        const match = cleanLine.match(/^(\* )?([^:]+):(.*)/);
        if (match) {
          return {
            type: "category",
            categoryType: match[2],
            content: match[3].trim(),
          };
        }
      }
      // Check if it's a list item
      else if (cleanLine.match(/^[\*\-] /)) {
        return { type: "listItem", content: cleanLine.substring(2) };
      }
      // Check if it's a numbered list item
      else if (cleanLine.match(/^\d+\. /)) {
        return {
          type: "numberedListItem",
          number: parseInt(cleanLine.match(/^(\d+)\./)?.[1] || "1"),
          content: cleanLine.substring(cleanLine.indexOf(". ") + 2),
        };
      }
      // Otherwise, it's a paragraph
      else if (cleanLine.trim()) {
        return { type: "paragraph", content: cleanLine };
      }
      // Empty line
      else {
        return { type: "empty" };
      }
    });

    return processedLines;
  };

  const processedPlan = processText(prepPlan);

  // Process questions to clean up markdown
  const processedQuestions = questions.map((q) =>
    q.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*([^*]+?)\*/g, "$1")
  );

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
          {processedPlan.map((line, index) => {
            if (!line) return null;

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
                  <Text key={index} style={styles.subSectionTitle}>
                    {line.content}
                  </Text>
                );
              case "phase":
                return (
                  <View key={index} style={styles.phaseSection}>
                    <Text style={styles.phaseTitle}>
                      {line.phaseType || ""}
                    </Text>
                    {line.content && (
                      <Text style={styles.text}>{line.content}</Text>
                    )}
                  </View>
                );
              case "step":
                return (
                  <View key={index} style={styles.stepSection}>
                    <Text style={styles.stepTitle}>{line.stepType || ""}</Text>
                    {line.content && (
                      <Text style={styles.text}>{line.content}</Text>
                    )}
                  </View>
                );
              case "listItem":
                return (
                  <Text key={index} style={styles.listItem}>
                    • {line.content}
                  </Text>
                );
              case "numberedListItem":
                return (
                  <Text key={index} style={styles.listItem}>
                    {line.number || index + 1}. {line.content}
                  </Text>
                );
              case "starSection":
                return (
                  <View key={index} style={styles.starSection}>
                    <Text style={styles.starTitle}>{line.starType || ""}:</Text>
                    <Text style={styles.text}>{line.content || ""}</Text>
                  </View>
                );
              case "category":
                return (
                  <View key={index} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>
                      {line.categoryType || ""}:
                    </Text>
                    <Text style={styles.text}>{line.content || ""}</Text>
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
        {processedQuestions.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Practice Questions</Text>
            <View style={styles.list}>
              {processedQuestions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>
                    Question {index + 1}
                  </Text>
                  <Text style={styles.questionText}>{question}</Text>
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
