import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Code,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
  HelpCircle,
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Clock,
  CheckCircle2,
  Zap,
  PenTool,
  Cpu,
  BarChart,
  Star,
  Timer,
  Award,
  TrendingUp,
  Search,
  Settings,
  RefreshCw,
  UserPlus,
  Mail,
  Briefcase,
} from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synthalyst - Home | Business & Productivity Platform",
  description:
    "Discover Synthalyst's comprehensive platform offering AI-powered tools, content, and services for professional development and business solutions.",
  alternates: {
    canonical: "https://synthalyst.com/",
  },
  openGraph: {
    title: "Synthalyst - Home | Business & Productivity Platform",
    description:
      "Discover Synthalyst's comprehensive platform offering AI-powered tools, content, and services for professional development and business solutions.",
    url: "https://synthalyst.com/",
    images: [
      {
        url: "/icons/og-image-home.png",
        width: 1200,
        height: 630,
        alt: "Synthalyst Home Page",
      },
    ],
  },
};

// Home page JSON-LD structured data
const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Synthalyst - Home | Business & Productivity Platform",
  description:
    "Discover Synthalyst's comprehensive platform offering AI-powered tools, content, and services for professional development and business solutions.",
  url: "https://synthalyst.com/",
  mainEntity: {
    "@type": "Organization",
    name: "Synthalyst",
    url: "https://synthalyst.com",
    logo: "https://synthalyst.com/icons/logo.png",
  },
};

export default function Home() {
  // Reorganize features by AI capability
  const aiCapabilities = [
    {
      category: "Career Development Tools",
      description:
        "Our AI-powered tools help you excel at every stage of your career journey",
      tools: [
        {
          icon: <FileText className="w-6 h-6" />,
          title: "ApplyRight",
          description:
            "Transform your resume with AI-powered optimization for specific job applications.",
          link: "/apply-right",
          badge: "New",
          preview:
            "Optimized resume with 85% keyword match to job description, professional formatting, and accomplishment-focused content...",
          aiFeature: "Resume Optimization",
        },
        {
          icon: <MessageSquare className="w-6 h-6" />,
          title: "Interview Prep",
          description:
            "Prepare for interviews with personalized plans and AI-powered mock interviews.",
          link: "/interview-prep",
          badge: "New",
          preview:
            "Your personalized interview plan includes 15 practice questions tailored to the Senior Developer role at TechCorp...",
          aiFeature: "Personalized Coaching",
        },
      ],
    },
    {
      category: "Content Generation",
      description:
        "Our AI excels at generating human-quality text for various professional needs",
      tools: [
        {
          icon: <Brain className="w-6 h-6" />,
          title: "JD Developer",
          description:
            "AI-powered job description generator tailored to your needs.",
          link: "/jd-developer",
          badge: "",
          preview:
            "Responsibilities include developing scalable web applications using React and Node.js, collaborating with cross-functional teams...",
          aiFeature: "Context Understanding",
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: "Training Plan Creator",
          description: "Generate comprehensive training plans and curricula.",
          link: "/training-plan",
          badge: "",
          preview:
            "Week 1: Introduction to React fundamentals, component lifecycle, and state management...",
          aiFeature: "Personalization",
        },
      ],
    },
    {
      category: "Intelligent Analysis",
      description:
        "Our AI analyzes complex information and provides structured insights",
      tools: [
        {
          icon: <HelpCircle className="w-6 h-6" />,
          title: "Interview Questions Generator",
          description:
            "Generate tailored interview questions based on job descriptions and competencies.",
          link: "/interview-questions",
          badge: "",
          preview:
            "Q: Describe a situation where you had to optimize a React application for performance. What tools did you use?",
          aiFeature: "Reasoning",
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Competency Manager",
          description:
            "Define and manage competency frameworks for your organization.",
          link: "/competency-manager",
          badge: "",
          preview:
            "Technical Leadership: Ability to guide technical decisions, mentor junior developers, and establish best practices...",
          aiFeature: "Pattern Recognition",
        },
      ],
    },
    {
      category: "Knowledge Processing",
      description:
        "Our AI processes and organizes knowledge to make it accessible and useful",
      tools: [
        {
          icon: <Code className="w-6 h-6" />,
          title: "Learning Content Creator",
          description: "Create tailored learning content for any topic.",
          link: "/learning-content",
          badge: "",
          preview:
            "Module 3: Advanced State Management with Redux - This module covers actions, reducers, and the store...",
          aiFeature: "Content Structuring",
        },
        {
          icon: <Sparkles className="w-6 h-6" />,
          title: "Knowledge GPT",
          description:
            "Expert teaching and knowledge curation at your fingertips.",
          link: "/knowledge-gpt",
          badge: "",
          preview:
            "The key difference between useEffect and useLayoutEffect is the timing of execution. useLayoutEffect fires synchronously...",
          aiFeature: "Expert Knowledge",
        },
      ],
    },
  ];

  // Updated stats with AI performance metrics
  const stats = [
    {
      label: "Average Response Time",
      value: "1.2s",
      icon: <Timer className="w-5 h-5 text-primary" />,
      description: "Our AI generates complete outputs in just seconds",
    },
    {
      label: "Accuracy Rating",
      value: "96%",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
      description: "Verified by independent quality assessments",
    },
    {
      label: "User Satisfaction",
      value: "4.9/5",
      icon: <Star className="w-5 h-5 text-primary" />,
      description: "Based on feedback from thousands of users",
    },
    {
      label: "Time Saved",
      value: "85%",
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      description: "Average time saved compared to manual processes",
    },
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd),
        }}
      />

      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 md:py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                AI-Powered Tools for
                <br />
                Professional Excellence
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-50">
                From optimizing your resume to preparing for interviews, our
                suite of AI tools helps you excel at every stage of your career
                journey.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link href="/tools">
                  <Button
                    size="lg"
                    className="bg-primary text-white hover:bg-white hover:text-primary min-w-[200px] transition-colors"
                  >
                    Try Our AI Tools
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-primary/20 hover:bg-white hover:text-primary hover:border-primary min-w-[200px] transition-colors"
                  >
                    Get Custom Solutions
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  <span>Intelligent</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>Accurate</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>Personalized</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Showcase Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Our AI in Action
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Watch how our AI transforms your career preparation process,
                from optimizing your resume to helping you ace your interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Before Side */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-gray-500 mr-2" />
                  <h3 className="text-xl font-semibold">
                    Traditional Approach
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Input</p>
                    <p className="font-medium">Resume + Job Description</p>
                    <p className="text-sm mt-2">
                      Hours of manual editing and formatting
                    </p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Hours of research and writing</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Multiple revisions needed</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Inconsistent quality</span>
                  </div>
                </div>
              </div>

              {/* After Side */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-xl font-semibold">AI-Powered Approach</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border border-gray-200">
                    <p className="text-sm text-primary mb-1">Same Input</p>
                    <p className="font-medium">Resume + Job Description</p>
                    <p className="text-sm mt-2">
                      Optimized in seconds with AI assistance
                    </p>
                  </div>
                  <div className="flex items-center text-primary text-sm">
                    <Zap className="w-4 h-4 mr-1" />
                    <span>Optimized resume in seconds</span>
                  </div>
                  <div className="flex items-center text-primary text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>Professionally written and formatted</span>
                  </div>
                  <div className="flex items-center text-primary text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>Tailored to specific job requirements</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="/apply-right">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Try ApplyRight Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required. Transform your first resume for free.
              </p>
            </div>

            <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm italic text-gray-700">
                    &ldquo;The AI-optimized resume and interview preparation
                    tools helped me land my dream job. The personalized feedback
                    and guidance were invaluable throughout my job search
                    process.&rdquo;
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    — Software Engineer, Tech Startup
                  </p>
                  <p className="text-xs text-gray-500">
                    <Link
                      href="/contact"
                      className="text-primary hover:underline"
                    >
                      Contact us for custom solutions for your business →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Reorganized by AI Capability */}
        <section className="py-20 px-4 bg-[#f5f5f7]">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Our AI Capabilities
            </h2>
            <p className="text-lg text-center mb-16 max-w-3xl mx-auto">
              Discover how our advanced AI technologies can transform your
              career and business processes with intelligent automation and
              expert-level outputs.
            </p>

            {aiCapabilities.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-20">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    {categoryIndex === 0 && (
                      <Briefcase className="w-6 h-6 mr-2 text-primary" />
                    )}
                    {categoryIndex === 1 && (
                      <PenTool className="w-6 h-6 mr-2 text-primary" />
                    )}
                    {categoryIndex === 2 && (
                      <BarChart className="w-6 h-6 mr-2 text-primary" />
                    )}
                    {categoryIndex === 3 && (
                      <Cpu className="w-6 h-6 mr-2 text-primary" />
                    )}
                    {category.category}
                  </h3>
                  <p className="text-gray-700">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={toolIndex}
                      href={tool.link}
                      className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
                    >
                      {tool.badge && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          {tool.badge}
                        </div>
                      )}
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          {tool.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xl font-semibold group-hover:text-primary">
                            {tool.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Sparkles className="w-3 h-3 text-primary mr-1" />
                            <span className="text-xs text-primary font-medium">
                              {tool.aiFeature}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-black mb-4">{tool.description}</p>

                      <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mt-4">
                        <p className="text-xs text-gray-500 mb-1">
                          AI Output Preview:
                        </p>
                        <p className="text-sm text-gray-700 italic line-clamp-2">
                          {tool.preview}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <span className="text-primary text-sm font-medium flex items-center group-hover:underline">
                          Try it now
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-8">
              <Link href="/tools">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Explore All AI Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm">
                <Link href="/contact" className="text-primary hover:underline">
                  Need a custom AI solution? Contact our team →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* How Our AI Works Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Our AI Works
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our advanced AI systems combine multiple technologies to deliver
                intelligent, personalized results that continuously improve over
                time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Step 1: Understanding Context */}
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Understanding Context
                </h3>
                <p className="text-gray-700 text-center mb-4">
                  Our AI analyzes your inputs and requirements, understanding
                  the context and nuances of your specific needs.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Processes natural language
                    </p>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Identifies key requirements
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Recognizes industry context
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Generating Content */}
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Settings className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Generating Personalized Content
                </h3>
                <p className="text-gray-700 text-center mb-4">
                  Using advanced language models, our AI creates tailored
                  content that matches your specific requirements.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Applies domain expertise
                    </p>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Structures information logically
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Tailors tone and style
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Continuous Improvement */}
              <div className="bg-white p-8 rounded-lg shadow-md relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <RefreshCw className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">
                  Continuous Learning
                </h3>
                <p className="text-gray-700 text-center mb-4">
                  Our AI systems continuously learn from user feedback to
                  improve accuracy and relevance over time.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Analyzes user feedback
                    </p>
                  </div>
                  <div className="flex items-start mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Refines response patterns
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                    <p className="text-sm text-gray-600">
                      Adapts to emerging trends
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Your Feedback Makes Our AI Smarter
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Every time you use our tools and provide feedback, our AI
                    gets better at understanding your needs and preferences.
                    This collaborative approach ensures our solutions
                    continuously evolve to meet your changing requirements.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/tools">
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        Try Our AI Tools
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        Share Your Feedback
                        <MessageCircle className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with AI Performance Metrics */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                AI Performance Metrics
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our AI solutions don&apos;t just save time—they deliver
                exceptional quality that exceeds human-level performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 text-center">
                    {stat.value}
                  </div>
                  <div className="text-black font-medium text-center mb-2">
                    {stat.label}
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium">
                  AI Excellence Certified
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">
                Our AI models undergo rigorous testing and continuous
                improvement to ensure they deliver the highest quality results
                for our users.
                <Link
                  href="/about"
                  className="text-primary hover:underline ml-1"
                >
                  Learn more about our AI quality standards →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Stay Ahead with Synthalyst
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Subscribe to our newsletter for the latest AI insights, tool
                updates, and exclusive content to help you maximize
                productivity.
              </p>

              <div className="max-w-xl mx-auto">
                <NewsletterSignup
                  variant="default"
                  buttonText="Subscribe"
                  placeholder="Enter your email"
                  className=""
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 hero-gradient">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Business Operations?
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Join the growing number of organizations already using Synthalyst
              to streamline their business processes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/tools">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-white hover:text-primary min-w-[200px] transition-colors"
                >
                  Try Our AI Tools
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-primary/20 hover:bg-white hover:text-primary hover:border-primary min-w-[200px] transition-colors"
                >
                  Get Custom Solutions
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-white">
              Have feedback on our AI tools?{" "}
              <Link
                href="/contact"
                className="font-medium bg-white/10 px-2 py-1 rounded-md text-white underline hover:bg-white/20 transition-colors"
              >
                Share your thoughts
              </Link>{" "}
              to help us improve.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
