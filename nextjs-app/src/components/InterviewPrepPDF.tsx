"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import @react-pdf/renderer components
const Document = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Page),
  { ssr: false }
);
const Text = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Text),
  { ssr: false }
);
const View = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.View),
  { ssr: false }
);

// Define styles outside the component to avoid re-creation on each render
const styles = {
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#1a365d",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: "#2d3748",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2d3748",
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
    lineHeight: 1.5,
  },
  timeline: {
    backgroundColor: "#f7fafc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  phase: {
    backgroundColor: "#edf2f7",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  goal: {
    backgroundColor: "#e6fffa",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  objective: {
    backgroundColor: "#ebf8ff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  star: {
    backgroundColor: "#faf5ff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  category: {
    backgroundColor: "#fff5f5",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
  },
  questionText: {
    fontSize: 12,
  },
  noQuestionsText: {
    fontSize: 12,
    fontStyle: "italic",
  },
};

interface Section {
  type: string;
  title: string;
  content?: string;
  items?: string[];
}

interface PrepPlan {
  sections: Section[];
}

interface InterviewPrepPDFProps {
  jobTitle: string;
  company?: string;
  industry?: string;
  prepPlan: PrepPlan;
  questions: string[];
}

export function InterviewPrepPDF({
  jobTitle,
  company,
  industry,
  prepPlan,
  questions,
}: InterviewPrepPDFProps) {
  useEffect(() => {
    console.log("InterviewPrepPDF component mounted");
    console.log("Props received:", {
      jobTitle,
      company,
      industry,
      prepPlanSections: prepPlan?.sections?.length || 0,
      questionsCount: questions?.length || 0,
    });

    // Check for potential issues
    if (!prepPlan) {
      console.error("prepPlan is undefined or null");
    } else if (!prepPlan.sections) {
      console.error("prepPlan.sections is undefined or null");
    } else if (!Array.isArray(prepPlan.sections)) {
      console.error("prepPlan.sections is not an array");
    }

    if (!questions) {
      console.error("questions is undefined or null");
    } else if (!Array.isArray(questions)) {
      console.error("questions is not an array");
    }

    // Register fonts on client side
    try {
      const registerFonts = async () => {
        const fontModule = await import("@react-pdf/renderer").then(
          (mod) => mod.Font
        );
        fontModule.register({
          family: "Roboto",
          fonts: [
            {
              src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
              fontWeight: "normal",
            },
            {
              src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
              fontWeight: "bold",
            },
          ],
        });
        console.log("Fonts registered successfully");
      };

      registerFonts();
    } catch (error) {
      console.error("Error registering fonts:", error);
    }
  }, [jobTitle, company, industry, prepPlan, questions]);

  // Function to clean any markdown syntax that might be present
  const cleanMarkdown = (text: string): string => {
    if (!text) return "";

    // Remove markdown formatting
    return text
      .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold markdown
      .replace(/\*([^*]+?)\*/g, "$1"); // Remove italic markdown
  };

  // Function to render a section
  const renderSection = (section: Section): React.ReactNode => {
    const sectionStyle = styles[section.type] || styles.section;

    return (
      <View style={sectionStyle}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.content && (
          <Text style={styles.text}>{cleanMarkdown(section.content)}</Text>
        )}
        {section.items && (
          <View style={styles.list}>
            {section.items.map((item, index) => (
              <Text key={index} style={styles.listItem}>
                • {cleanMarkdown(item)}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Interview Preparation Plan</Text>
          <Text style={styles.subtitle}>Position: {jobTitle}</Text>
          {company && <Text style={styles.subtitle}>Company: {company}</Text>}
          {industry && (
            <Text style={styles.subtitle}>Industry: {industry}</Text>
          )}
        </View>

        <View style={styles.section}>
          {prepPlan &&
            prepPlan.sections &&
            prepPlan.sections.map((section, index) => (
              <React.Fragment key={index}>
                {renderSection(section)}
              </React.Fragment>
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Questions</Text>
          <View style={styles.list}>
            {questions && questions.length > 0 ? (
              questions.map((question, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <Text style={styles.questionText}>
                    {cleanMarkdown(question)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noQuestionsText}>
                No practice questions generated.
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InterviewPrepPDF;
