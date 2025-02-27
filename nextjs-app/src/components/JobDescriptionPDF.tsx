import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { JobDescription } from "@/types/jobDescription";

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
  skillSection: {
    marginBottom: 10,
  },
  skillTitle: {
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
});

interface JobDescriptionPDFProps {
  jd: JobDescription;
}

export default function JobDescriptionPDF({ jd }: JobDescriptionPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{jd.title}</Text>
          <Text style={styles.subtitle}>
            {jd.department && `${jd.department} • `}
            {jd.location && `${jd.location} • `}
            {jd.employmentType}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.text}>{jd.description}</Text>
        </View>

        {/* Responsibilities */}
        {jd.responsibilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsibilities</Text>
            <View style={styles.list}>
              {jd.responsibilities.map((resp, index) => (
                <Text key={index} style={styles.listItem}>
                  • {resp}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Required Skills */}
        {jd.requirements.required.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            {jd.requirements.required.map((skill, index) => (
              <View key={index} style={styles.skillSection}>
                <Text style={styles.skillTitle}>
                  {skill.name} -{" "}
                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                </Text>
                <Text style={styles.text}>{skill.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Preferred Skills */}
        {jd.requirements.preferred && jd.requirements.preferred.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Skills</Text>
            {jd.requirements.preferred.map((skill, index) => (
              <View key={index} style={styles.skillSection}>
                <Text style={styles.skillTitle}>
                  {skill.name} -{" "}
                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                </Text>
                <Text style={styles.text}>{skill.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Qualifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qualifications</Text>

          {/* Education */}
          {jd.qualifications.education &&
            jd.qualifications.education.length > 0 && (
              <View style={styles.skillSection}>
                <Text style={styles.skillTitle}>Education</Text>
                <View style={styles.list}>
                  {jd.qualifications.education.map((edu, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {edu}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          {/* Experience */}
          {jd.qualifications.experience &&
            jd.qualifications.experience.length > 0 && (
              <View style={styles.skillSection}>
                <Text style={styles.skillTitle}>Experience</Text>
                <View style={styles.list}>
                  {jd.qualifications.experience.map((exp, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {exp}
                    </Text>
                  ))}
                </View>
              </View>
            )}

          {/* Certifications */}
          {jd.qualifications.certifications &&
            jd.qualifications.certifications.length > 0 && (
              <View style={styles.skillSection}>
                <Text style={styles.skillTitle}>Certifications</Text>
                <View style={styles.list}>
                  {jd.qualifications.certifications.map((cert, index) => (
                    <Text key={index} style={styles.listItem}>
                      • {cert}
                    </Text>
                  ))}
                </View>
              </View>
            )}
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataItem}>
            Industry: {jd.metadata.industry}
          </Text>
          <Text style={styles.metadataItem}>Level: {jd.metadata.level}</Text>
          <Text style={styles.metadataItem}>
            Created: {new Date(jd.metadata.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.metadataItem}>
            Last Updated: {new Date(jd.metadata.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
