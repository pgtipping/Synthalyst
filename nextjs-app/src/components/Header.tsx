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
  Code,
  Sparkles,
  Users,
} from "lucide-react";
import { useToast } from "@/lib/toast-migration";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SynthalystLogo from "./SynthalystLogo";

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

  const tools = [
    {
      icon: <Brain className="w-4 h-4 mr-2" />,
      title: "JD Developer",
      href: "/jd-developer",
    },
    {
      icon: <Target className="w-4 h-4 mr-2" />,
      title: "2Do Task Manager",
      href: "/2do",
    },
    {
      icon: <FileText className="w-4 h-4 mr-2" />,
      title: "Training Plan Creator",
      href: "/training-plan",
    },
    {
      icon: <Code className="w-4 h-4 mr-2" />,
      title: "Learning Content Creator",
      href: "/learning-content",
    },
    {
      icon: <Sparkles className="w-4 h-4 mr-2" />,
      title: "Knowledge GPT",
      href: "/knowledge-gpt",
    },
    {
      icon: <Users className="w-4 h-4 mr-2" />,
      title: "Competency Manager",
      href: "/competency-manager",
    },
  ];

  const renderAuthButton = () => {
    if (status === "loading") {
      return (
        <Button variant="ghost" disabled className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin =
        session.user.role === "ADMIN" ||
        session.user.email === "pgtipping1@gmail.com";

      // Debug session and role
      console.log("Session:", session);
      console.log("User role:", session.user.role);
      console.log("User email:", session.user.email);
      console.log("Is admin:", isAdmin);

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {session.user.email}
          </span>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Logout
          </Button>
        </div>
      );
    }

    return (
      <Link href="/login">
        <Button variant="ghost" className="flex items-center gap-2">
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
          Loading...
        </Button>
      );
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin =
        session.user.role === "ADMIN" ||
        session.user.email === "pgtipping1@gmail.com";

      // Debug session and role (mobile)
      console.log("Mobile Session:", session);
      console.log("Mobile User role:", session.user.role);
      console.log("Mobile User email:", session.user.email);
      console.log("Mobile Is admin:", isAdmin);

      return (
        <>
          <div className="text-sm text-muted-foreground mb-2">
            {session.user.email}
          </div>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full mb-2"
              >
                <Users className="w-4 h-4" />
                Admin Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full"
          >
            <User className="w-4 h-4" />
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
            <SynthalystLogo />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-between md:flex-1">
          <nav className="flex items-center space-x-8 ml-12">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-muted-foreground hover:text-foreground transition-colors dropdown-tools-trigger">
                Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {tools.map((tool, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      href={tool.href}
                      className="flex items-center text-black"
                    >
                      {tool.icon}
                      <span>{tool.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link
                    href="/tools"
                    className="flex items-center font-medium text-primary"
                  >
                    View All Tools
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            {renderAuthButton()}
            <Link href="/get-started">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-24 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container flex flex-col space-y-4 p-4">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </Link>

              {/* Mobile Tools Submenu */}
              <div className="pl-4 space-y-2">
                <div className="font-medium">Tools</div>
                {tools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="flex items-center text-sm text-black hover:text-black/80 transition-colors py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    {tool.icon}
                    <span>{tool.title}</span>
                  </Link>
                ))}
                <Link
                  href="/tools"
                  className="flex items-center text-sm font-medium text-primary py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  View All Tools
                </Link>
              </div>

              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
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
