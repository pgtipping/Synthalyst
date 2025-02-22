import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Code2, FileText, Brain, Calendar } from "lucide-react";

interface ToolCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  status: "available" | "coming-soon";
}

const tools: ToolCard[] = [
  {
    title: "JD Developer",
    description: "Create professional job descriptions powered by AI",
    href: "/jd-developer",
    icon: <FileText className="h-6 w-6" />,
    status: "available",
  },
  {
    title: "2Do Task Manager",
    description: "AI-powered task management and scheduling",
    href: "/2do",
    icon: <Calendar className="h-6 w-6" />,
    status: "coming-soon",
  },
  {
    title: "Training Plan Creator",
    description: "Generate personalized learning plans and curricula",
    href: "/training-plan",
    icon: <Brain className="h-6 w-6" />,
    status: "coming-soon",
  },
  {
    title: "Competency Manager",
    description: "Develop competency frameworks for any skill or industry",
    href: "/competency",
    icon: <Code2 className="h-6 w-6" />,
    status: "coming-soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools", active: true },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI-Powered Tools</h1>
        <p className="text-muted-foreground">
          Enhance your productivity with our suite of AI-powered tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            className={`p-6 hover:shadow-lg transition-shadow ${
              tool.status === "coming-soon"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent/5"
            }`}
          >
            {tool.status === "available" ? (
              <Link
                href={tool.href}
                className="flex items-start space-x-4 no-underline"
              >
                <div className="shrink-0">{tool.icon}</div>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{tool.title}</h2>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-start space-x-4">
                <div className="shrink-0">{tool.icon}</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">{tool.title}</h2>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
