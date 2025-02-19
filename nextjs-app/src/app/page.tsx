import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Code,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export default function Home() {
  const features = [
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

  const stats = [
    { label: "Active Users", value: "1,000+" },
    { label: "Documents Generated", value: "5,000+" },
    { label: "Training Plans Created", value: "500+" },
    { label: "Client Satisfaction", value: "98%" },
  ];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 hero-gradient">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your HR Operations
              <br />
              with AI-Powered Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-50">
              Streamline your HR processes with our suite of intelligent tools.
              From job descriptions to competency management, we've got you
              covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/services">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-blue-50 min-w-[200px]"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-primary/20 min-w-[200px]"
                >
                  Contact Sales
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Intelligent Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 hero-gradient">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Join thousands of organizations already using Synthalyst to
            streamline their HR processes.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-blue-50 min-w-[200px]"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
