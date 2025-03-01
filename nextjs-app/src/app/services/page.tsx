import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Brain,
  Target,
  Code,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  HeartHandshake,
} from "lucide-react";

export default function Services() {
  const freeServices = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Document Templates",
      description:
        "Access a library of free document templates for your business needs.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Basic Job Description Generator",
      description: "Generate simple job descriptions with our free AI tool.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Simple Task Management",
      description: "Organize your tasks with our basic task management tool.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Learning Content Creator",
      description: "Create tailored learning content for any topic.",
    },
  ];

  const premiumServices = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Advanced AI Tools",
      description:
        "Full access to all our AI-powered tools with enhanced capabilities.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Priority Support",
      description: "Get priority customer support and dedicated assistance.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Unlimited Usage",
      description: "No limits on document generation or tool usage.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: "Customization",
      description:
        "Customize our tools to match your organization's specific needs.",
    },
  ];

  const tools = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "JD Developer",
      description:
        "AI-powered job description generator tailored to your needs.",
      link: "/jd-developer",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "2Do Task Manager",
      description:
        "Smart task management with voice input and calendar integration.",
      link: "/2do",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Training Plan Creator",
      description: "Generate comprehensive training plans and curricula.",
      link: "/training-plan",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Learning Content Creator",
      description: "Create tailored learning content for any topic.",
      link: "/learning-content",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Knowledge GPT",
      description: "Expert teaching and knowledge curation at your fingertips.",
      link: "/knowledge-gpt",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Competency Manager",
      description:
        "Define and manage competency frameworks for your organization.",
      link: "/competency-manager",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services", active: true },
          ]}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl">
            Discover our range of AI-powered tools and services designed to
            enhance your operations and productivity.
          </p>
        </div>

        {/* Free Services */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-black mb-8">Free Services</h2>
          <p className="text-lg text-black leading-relaxed mb-8">
            We offer a range of free services to help you get started with your
            needs. These include access to free forms, templates, and basic
            tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {freeServices.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-black text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/login">
              <Button variant="outline" className="group">
                Get Started with Free Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium Services */}
        <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold text-black">Premium Services</h2>
          </div>

          <p className="text-lg text-black leading-relaxed mb-8">
            Upgrade to our premium services for enhanced features, unlimited
            usage, and priority support. Our premium plans are designed for
            businesses that need more advanced HR solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {premiumServices.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-black text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/contact">
              <Button className="group">
                Contact Us for Premium Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Our Tools */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Our AI-Powered Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={index}
                href={tool.link}
                className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100"
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
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of organizations already using Synthalyst to
            streamline their HR processes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 min-w-[200px]"
              >
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
