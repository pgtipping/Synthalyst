"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();

  // Debug session state
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Session Status:", status);
      console.log("Session Data:", session);
    }
  }, [session, status]);

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
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {session.user.email}
          </span>
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-6xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Synthalyst</span>
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
        <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
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
          <div className="absolute top-14 left-0 right-0 bg-background border-b md:hidden">
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
                {renderAuthButton()}
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
