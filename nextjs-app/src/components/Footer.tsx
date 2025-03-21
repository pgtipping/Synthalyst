"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isExpanded, setIsExpanded] = useState(false);

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Tools", href: "/tools" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Guides", href: "/guides" },
        { label: "API Reference", href: "/api-reference" },
        { label: "Support", href: "/support" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
  ];

  const toggleFooter = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 transition-all duration-300">
      {/* Compact Footer - Always visible */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="inline-block">
            <h2 className="text-lg font-bold text-white">Synthalyst</h2>
          </Link>
          <p className="text-gray-400 hidden md:block">
            © {currentYear} Synthalyst
          </p>
        </div>

        {/* Social Icons - Always visible */}
        <div className="flex items-center">
          <div className="flex space-x-4 mr-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleFooter}
            className="flex items-center justify-center p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-expanded="false"
            aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Footer Content */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          {/* Newsletter Signup - Centered at the top */}
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-xl mx-auto mb-8">
              <h3 className="text-white font-semibold mb-3 text-center">
                Subscribe to our newsletter
              </h3>
              <NewsletterSignup variant="minimal" className="w-full" />
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h3 className="text-white font-semibold mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer Bottom */}
            <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 md:hidden">
                © {currentYear} Synthalyst. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/cookies"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>

              {/* Social Icons - Also in expanded footer */}
              <div className="mt-4 md:mt-0 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
