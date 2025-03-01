import { Breadcrumb } from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Users, Globe, Award, BookOpen, Lightbulb } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "User-Centered",
      description: "We put our users first in everything we build and design.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description:
        "We constantly explore new technologies to improve our solutions.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Excellence",
      description:
        "We strive for the highest quality in all our products and services.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Continuous Learning",
      description:
        "We believe in the power of knowledge and lifelong learning.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about", active: true },
          ]}
        />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Synthalyst
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl">
            Empowering organizations and individuals with AI-powered tools for
            enhanced productivity and growth.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To democratize access to advanced AI tools that enhance
              productivity, learning, and professional development for
              individuals and organizations worldwide.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To become the leading platform for AI-powered productivity and
              learning solutions, making advanced technology accessible to
              everyone regardless of technical expertise.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Synthalyst is a mobile-first web application designed to provide a
              suite of online tools and services for personal and business
              productivity enhancements. We cater to a global audience, with a
              focus on users in Nigeria and across Africa.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded in 2023, our team consists of passionate developers, AI
              specialists, and HR professionals who understand the challenges
              faced by modern organizations and individuals in today&apos;s
              fast-paced digital environment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our AI-powered assistance helps with tasks such as job description
              generation, task management, training plan creation, and learning
              content development - all designed to save you time and improve
              outcomes.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600"
              >
                <div className="text-blue-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Presence */}
        <div className="bg-gray-100 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Global Presence
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                While we&apos;re proudly based in Nigeria, our solutions are
                used by clients across Africa and around the world. We
                understand the unique challenges faced by businesses in emerging
                markets and design our tools accordingly.
              </p>
              <div className="flex items-center gap-2 text-blue-600">
                <Globe className="w-5 h-5" />
                <span className="font-medium">
                  Serving clients in over 10 countries
                </span>
              </div>
            </div>
            <div className="md:w-1/2 relative h-[300px] w-full rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-blue-900/20 z-10 rounded-xl"></div>
              <Image
                src="/images/world-map.jpg"
                alt="Global presence"
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x400/0066cc/FFFFFF?text=Global+Presence";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
