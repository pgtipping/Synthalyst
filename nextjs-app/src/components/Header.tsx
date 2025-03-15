"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Loader2,
  ChevronDown,
  Brain,
  Target,
  FileText,
  Users,
  Mail,
  FileCheck,
  Briefcase,
  Package,
} from "lucide-react";
import { useToast } from "@/lib/toast-migration";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SynthalystLogoAnimated from "./SynthalystLogoAnimated";

// Define the Tool interface
interface Tool {
  icon: React.ReactNode;
  title: string;
  href: string;
  external?: boolean;
}

// Extend the Session type to include role
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } & Session["user"];
}

export default function Header() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  // Debug session state - removed for production
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     console.log("Session Status:", status);
  //     console.log("Session Data:", session);
  //   }
  // }, [session, status]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tools: Tool[] = [
    {
      icon: <FileCheck className="w-4 h-4 mr-2" />,
      title: "ApplyRight",
      href: "/apply-right",
    },
    {
      icon: <Briefcase className="w-4 h-4 mr-2" />,
      title: "Interview Prep",
      href: "/interview-prep",
    },
    {
      icon: <Package className="w-4 h-4 mr-2" />,
      title: "Career Bundle",
      href: "/career-bundle",
    },
    {
      icon: <FileText className="w-4 h-4 mr-2" />,
      title: "Interview Questions Generator",
      href: "/interview-questions",
    },
    {
      icon: <Brain className="w-4 h-4 mr-2" />,
      title: "JD Developer",
      href: "/jd-developer",
    },
    {
      icon: <FileText className="w-4 h-4 mr-2" />,
      title: "Training Plan Creator",
      href: "/training-plan",
    },
    {
      icon: <Users className="w-4 h-4 mr-2" />,
      title: "Competency Manager",
      href: "/competency-manager",
    },
    {
      icon: <Target className="w-4 h-4 mr-2" />,
      title: "Turnover Calculator",
      href: "/coming-soon?tool=Turnover%20Calculator",
    },
    {
      icon: <FileText className="w-4 h-4 mr-2" />,
      title: "InQDoc",
      href: "https://inqdoc.synthalyst.com/",
      external: true,
    },
  ];

  const renderAuthButton = () => {
    if (status === "loading") {
      return (
        <Button variant="ghost" disabled className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </Button>
      );
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin =
        session.user.role === "ADMIN" ||
        session.user.email === "pgtipping1@gmail.com";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-primary"
          >
            <User className="w-4 h-4" />
            <span className="sr-only">User Account</span>
          </Button>
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2"
            size="sm"
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-gray-900 border-gray-400"
        >
          <User className="w-4 h-4" />
          Login
        </Button>
      </Link>
    );
  };

  const renderMobileAuthButton = () => {
    if (status === "loading") {
      return (
        <Button
          variant="ghost"
          disabled
          className="flex items-center gap-2 w-full"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </Button>
      );
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin =
        session.user.role === "ADMIN" ||
        session.user.email === "pgtipping1@gmail.com";

      return (
        <>
          <div className="flex items-center gap-2 text-primary mb-2">
            <User className="w-4 h-4" />
            <span className="text-sm">Logged in</span>
          </div>
          {isAdmin && (
            <>
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full mb-2"
                >
                  <Users className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              </Link>
              <Link href="/admin/newsletter" onClick={() => setMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full mb-2"
                >
                  <Mail className="w-4 h-4" />
                  Newsletter Management
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full"
          >
            Logout
          </Button>
        </>
      );
    }

    return (
      <>
        <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
          <Button variant="outline" className="w-full mb-2">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
          <Button variant="secondary" className="w-full">
            Sign Up
          </Button>
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 max-w-6xl items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <SynthalystLogoAnimated />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-between md:flex-1">
          <nav className="flex items-center space-x-4 lg:space-x-8 ml-6 lg:ml-12">
            <Link
              href="/about"
              className="text-sm lg:text-base text-gray-900 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-sm lg:text-base text-gray-900 hover:text-foreground transition-colors"
            >
              Services
            </Link>

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm lg:text-base text-gray-900 hover:text-foreground transition-colors dropdown-tools-trigger">
                Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {tools.map((tool, index) => (
                  <DropdownMenuItem key={index} asChild>
                    {tool.external ? (
                      <a
                        href={tool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-900"
                      >
                        {tool.icon}
                        <span className="text-sm">{tool.title}</span>
                      </a>
                    ) : (
                      <Link
                        href={tool.href}
                        className="flex items-center text-gray-900"
                      >
                        {tool.icon}
                        <span className="text-sm">{tool.title}</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link
                    href="/tools"
                    className="flex items-center font-medium text-gray-900"
                  >
                    <span className="text-sm">View All Tools</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blog"
              className="text-sm lg:text-base text-gray-900 hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm lg:text-base text-gray-900 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-2 lg:space-x-4">
            {renderAuthButton()}
            <Link href="/get-started">
              <Button size="sm" className="lg:text-base">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <button
          className="ml-auto md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {menuOpen && (
          <div className="absolute top-24 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container flex flex-col space-y-4 p-4">
              <Link
                href="/about"
                className="text-gray-900 hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-gray-900 hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </Link>

              {/* Mobile Tools Submenu */}
              <div className="pl-4 space-y-2">
                <div className="font-medium">Tools</div>
                {tools.map((tool, index) =>
                  tool.external ? (
                    <a
                      key={index}
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-900 hover:text-gray-900/80 transition-colors py-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tool.icon}
                      <span>{tool.title}</span>
                    </a>
                  ) : (
                    <Link
                      key={index}
                      href={tool.href}
                      className="flex items-center text-sm text-gray-900 hover:text-gray-900/80 transition-colors py-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tool.icon}
                      <span>{tool.title}</span>
                    </Link>
                  )
                )}
                <Link
                  href="/tools"
                  className="flex items-center text-sm font-medium text-gray-900 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  View All Tools
                </Link>
              </div>

              <Link
                href="/blog"
                className="text-gray-900 hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-900 hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {renderMobileAuthButton()}
                <Link href="/get-started" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
