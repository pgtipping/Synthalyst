"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-6xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Synthalyst</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 ml-auto">
          <Link
            href="/training-plan"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Training Plans
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Button variant="ghost">Login</Button>
        </nav>
      </div>
    </header>
  );
}
