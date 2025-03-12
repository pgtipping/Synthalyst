import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-700">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {item.active ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "text-gray-700 hover:text-foreground transition-colors",
                item.active && "text-foreground font-medium"
              )}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
