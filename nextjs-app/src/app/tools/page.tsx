import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import {
  Brain,
  Target,
  FileText,
  Code,
  Sparkles,
  Users,
  BookOpen,
  Grid3X3,
  FileQuestion,
  Layers,
  Newspaper,
  Calculator,
  Languages,
  UserPlus,
  FileCheck,
  Briefcase,
} from "lucide-react";
import { ReactNode } from "react";

interface Tool {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
  status: "available" | "coming-soon";
  isExternal?: boolean;
}

interface ToolLinkProps {
  children: ReactNode;
  tool: Tool;
}

export default function ToolsPage() {
  // List of tools that have actual routes in the app
  const existingRoutes = [
    "/apply-right",
    "/interview-prep",
    "/career-bundle",
    "/interview-questions",
    "/jd-developer",
    "/training-plan",
    "/competency-manager",
    "/2do",
    "/knowledge-gpt",
    "/learning-content",
    "/blog",
  ];

  const tools: Tool[] = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "ApplyRight",
      description:
        "Transform your resume with AI-powered enhancements and optimizations for job applications.",
      link: "/apply-right",
      status: "available",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interview Prep",
      description:
        "Prepare for interviews with AI-generated practice questions and personalized preparation plans.",
      link: "/interview-prep",
      status: "available",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Career Bundle",
      description:
        "Complete career solution combining ApplyRight and Interview Prep for end-to-end job application support.",
      link: "/career-bundle",
      status: "available",
    },
    {
      icon: <FileQuestion className="w-8 h-8" />,
      title: "Interview Questions Generator",
      description:
        "Generate tailored interview questions based on job descriptions.",
      link: "/interview-questions",
      status: "available",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "JD Developer",
      description:
        "AI-powered job description generator tailored to your needs.",
      link: "/jd-developer",
      status: "available",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Training Plan Creator",
      description: "Generate comprehensive training plans and curricula.",
      link: "/training-plan",
      status: "available",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Competency Manager",
      description:
        "Define and manage competency frameworks for your organization.",
      link: "/competency-manager",
      status: "available",
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Turnover Calculator",
      description: "Calculate employee turnover rates based on exit data.",
      link: existingRoutes.includes("/turnover-calculator")
        ? "/turnover-calculator"
        : "/coming-soon",
      status: existingRoutes.includes("/turnover-calculator")
        ? "available"
        : "coming-soon",
    },
    {
      icon: <FileQuestion className="w-8 h-8" />,
      title: "InQDoc",
      description: "Document Question Answering System for your documents.",
      link: "https://inqdoc.synthalyst.com/",
      isExternal: true,
      status: "available",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "2Do Task Manager",
      description:
        "Smart task management with voice input and calendar integration.",
      link: "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Knowledge GPT",
      description:
        "Expert teaching and knowledge curation with specialized domains including medical research.",
      link: "/knowledge-gpt",
      status: "available",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Learning Content Creator",
      description: "Create tailored learning content for any topic.",
      link: "/learning-content",
      status: "available",
    },
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: "Cozy Corner",
      description: "Bloggers' haven. Write blogs with AI assisted resources.",
      link: "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <Grid3X3 className="w-8 h-8" />,
      title: "Competency Matrix Creator",
      description: "Create competency matrices for any skill or industry.",
      link: existingRoutes.includes("/competency-matrix")
        ? "/competency-matrix"
        : "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Form Builder",
      description: "Create forms with a drag and drop interface.",
      link: existingRoutes.includes("/form-builder")
        ? "/form-builder"
        : "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Meeting Sec",
      description:
        "Transcribe audio into notes and create meeting minutes, calendar events, and to-dos.",
      link: existingRoutes.includes("/meeting-sec")
        ? "/meeting-sec"
        : "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Language Tutor",
      description:
        "Learn any language with voice translation and pronunciation feedback.",
      link: existingRoutes.includes("/language-tutor")
        ? "/language-tutor"
        : "/coming-soon",
      status: "coming-soon",
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "AI Onboarder",
      description:
        "Seamless starts for every new journey. Create comprehensive onboarding programs for new employees.",
      link: existingRoutes.includes("/ai-onboarder")
        ? "/ai-onboarder"
        : "/coming-soon",
      status: "coming-soon",
    },
  ];

  const ToolLink = ({ children, tool }: ToolLinkProps) => {
    if (tool.isExternal) {
      return (
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={tool.link} className="block h-full">
        {children}
      </Link>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools", active: true },
          ]}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Powered Tools
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl">
            Explore our suite of intelligent tools designed to enhance your
            productivity and streamline your operations.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            return (
              <div key={index} className="relative">
                {tool.status === "coming-soon" && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Coming Soon
                  </div>
                )}
                <ToolLink tool={tool}>
                  <div
                    className={`group h-full bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100 ${
                      tool.status === "coming-soon" ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {tool.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                      {tool.title}
                    </h3>
                    <p className="text-black">{tool.description}</p>
                    {tool.isExternal && (
                      <div className="mt-4 text-sm text-blue-600">
                        Opens in a new tab
                      </div>
                    )}
                  </div>
                </ToolLink>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Tool?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Don&apos;t see what you&apos;re looking for? We can build custom
            AI-powered tools tailored to your specific needs.
          </p>
          <Link href="/contact">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
