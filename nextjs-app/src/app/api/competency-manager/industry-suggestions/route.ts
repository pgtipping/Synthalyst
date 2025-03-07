import { NextResponse } from "next/server";

// Industry-specific competency suggestions
const industrySuggestions = {
  Technology: [
    {
      name: "Software Development",
      type: "Technical",
      description:
        "Ability to design, develop, and maintain software applications using modern programming languages and frameworks.",
    },
    {
      name: "Cloud Architecture",
      type: "Technical",
      description:
        "Knowledge of cloud platforms, services, and best practices for designing scalable and resilient cloud-based solutions.",
    },
    {
      name: "Data Analysis",
      type: "Technical",
      description:
        "Ability to collect, process, and analyze data to extract meaningful insights and support decision-making.",
    },
    {
      name: "Cybersecurity",
      type: "Technical",
      description:
        "Knowledge of security principles and practices to protect systems, networks, and data from threats and vulnerabilities.",
    },
    {
      name: "Agile Methodologies",
      type: "Process",
      description:
        "Understanding and application of agile frameworks and practices for software development and project management.",
    },
  ],
  Healthcare: [
    {
      name: "Clinical Knowledge",
      type: "Domain",
      description:
        "Understanding of medical terminology, procedures, and healthcare delivery systems.",
    },
    {
      name: "Patient Care",
      type: "Core",
      description:
        "Ability to provide compassionate and effective care to patients with diverse needs and backgrounds.",
    },
    {
      name: "Healthcare Compliance",
      type: "Regulatory",
      description:
        "Knowledge of healthcare regulations, standards, and best practices for ensuring compliance and quality care.",
    },
    {
      name: "Medical Documentation",
      type: "Administrative",
      description:
        "Ability to accurately document patient information, treatments, and outcomes in accordance with standards.",
    },
    {
      name: "Healthcare Technology",
      type: "Technical",
      description:
        "Proficiency with healthcare-specific technologies, systems, and equipment used in patient care and administration.",
    },
  ],
  Finance: [
    {
      name: "Financial Analysis",
      type: "Technical",
      description:
        "Ability to analyze financial data, identify trends, and make recommendations based on financial performance.",
    },
    {
      name: "Risk Management",
      type: "Core",
      description:
        "Knowledge of principles and practices for identifying, assessing, and mitigating financial and operational risks.",
    },
    {
      name: "Regulatory Compliance",
      type: "Regulatory",
      description:
        "Understanding of financial regulations, reporting requirements, and compliance standards in the finance industry.",
    },
    {
      name: "Investment Management",
      type: "Technical",
      description:
        "Knowledge of investment strategies, portfolio management, and asset allocation principles.",
    },
    {
      name: "Financial Reporting",
      type: "Administrative",
      description:
        "Ability to prepare accurate and timely financial reports in accordance with accounting standards and regulations.",
    },
  ],
  Education: [
    {
      name: "Instructional Design",
      type: "Core",
      description:
        "Ability to design effective learning experiences, curricula, and educational materials for diverse learners.",
    },
    {
      name: "Student Assessment",
      type: "Core",
      description:
        "Knowledge of assessment methods and tools to evaluate student learning and provide constructive feedback.",
    },
    {
      name: "Educational Technology",
      type: "Technical",
      description:
        "Proficiency with digital tools, platforms, and technologies that enhance teaching and learning.",
    },
    {
      name: "Classroom Management",
      type: "Core",
      description:
        "Ability to create and maintain a positive, inclusive, and productive learning environment.",
    },
    {
      name: "Curriculum Development",
      type: "Core",
      description:
        "Knowledge of curriculum design principles and ability to develop comprehensive educational programs.",
    },
  ],
  Manufacturing: [
    {
      name: "Production Management",
      type: "Core",
      description:
        "Ability to plan, coordinate, and optimize manufacturing operations to meet quality and efficiency targets.",
    },
    {
      name: "Quality Control",
      type: "Core",
      description:
        "Knowledge of quality assurance principles, methods, and tools to ensure product quality and consistency.",
    },
    {
      name: "Supply Chain Management",
      type: "Process",
      description:
        "Understanding of supply chain processes, logistics, and inventory management in manufacturing environments.",
    },
    {
      name: "Lean Manufacturing",
      type: "Process",
      description:
        "Knowledge of lean principles and practices to eliminate waste and improve efficiency in production processes.",
    },
    {
      name: "Industrial Safety",
      type: "Regulatory",
      description:
        "Understanding of safety regulations, hazard identification, and risk mitigation in manufacturing settings.",
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get("industry");

  if (!industry) {
    return NextResponse.json(
      { error: "Industry parameter is required" },
      { status: 400 }
    );
  }

  const suggestions =
    industrySuggestions[industry as keyof typeof industrySuggestions] || [];

  return NextResponse.json({
    industry,
    suggestions,
  });
}
