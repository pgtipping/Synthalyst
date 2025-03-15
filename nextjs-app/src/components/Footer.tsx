import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          {/* Logo and Description */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold text-white">Synthalyst</h2>
            </Link>
            <p className="mt-2 text-gray-400 text-xs max-w-md">
              Empowering you with AI-driven tools for personal and business
              productivity. Work smarter, live better.
            </p>
            <div className="mt-3 flex space-x-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-white text-xs font-semibold mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1 text-xs">
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

          {/* Newsletter Signup - Hidden on mobile to save space */}
          <div className="col-span-2 md:col-span-2 mt-4 md:mt-0 hidden md:block">
            <h3 className="text-white text-xs font-semibold mb-2">
              Subscribe to our newsletter
            </h3>
            <NewsletterSignup variant="minimal" className="max-w-md" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-300">
            © {currentYear} Synthalyst. All rights reserved.
          </p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <Link
              href="/terms"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
