const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Copying UI components to build directory...");

// Create components in the src directory
// This ensures they exist for the build process
const componentsDir = path.resolve(__dirname, "../src/components/ui");
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Ensure lib/utils.ts exists for the cn function
const libDir = path.resolve(__dirname, "../src/lib");
const utilsPath = path.join(libDir, "utils.ts");
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

if (!fs.existsSync(utilsPath)) {
  console.log("Creating utils.ts...");
  const utilsContent = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  fs.writeFileSync(utilsPath, utilsContent.trim());
}

// Essential UI components that are required for the build
const essentialComponents = [
  {
    name: "breadcrumb.tsx",
    content: `
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
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-2 text-sm text-gray-700",
        className
      )}
    >
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
`,
  },
  {
    name: "button.tsx",
    content: `
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
            "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
`,
  },
  {
    name: "card.tsx",
    content: `
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`,
  },
  {
    name: "tabs.tsx",
    content: `
import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = ({ children, className, ...props }) => (
  <div className={cn("w-full", className)} {...props}>
    {children}
  </div>
);

const TabsList = ({ children, className, ...props }) => (
  <div
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      active
        ? "bg-background text-foreground shadow"
        : "hover:bg-background/50 hover:text-foreground",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, active, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      active ? "block" : "hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
`,
  },
];

// Create essential components if they don't exist
essentialComponents.forEach((component) => {
  const componentPath = path.join(componentsDir, component.name);

  console.log(`Checking component: ${component.name}`);

  if (!fs.existsSync(componentPath)) {
    console.log(`Creating missing component: ${component.name}`);
    fs.writeFileSync(componentPath, component.content.trim());
  } else {
    const existingContent = fs.readFileSync(componentPath, "utf8");

    // Check if the component contains 'cn' utility
    if (!existingContent.includes("import { cn }")) {
      console.log(
        `Component ${component.name} needs to be updated with cn utility`
      );
      fs.writeFileSync(componentPath, component.content.trim());
    } else {
      console.log(
        `Component ${component.name} already exists and has cn utility`
      );
    }
  }
});

// Install required dependencies
try {
  console.log("Installing required dependencies...");
  execSync("npm install --save clsx tailwind-merge", { stdio: "inherit" });
  console.log("Dependencies installed successfully");
} catch (error) {
  console.error("Error installing dependencies:", error.message);
}

// Generate index.ts file to export all components
const indexPath = path.join(componentsDir, "index.ts");
console.log("Generating index.ts for component exports...");

let indexContent = "// Auto-generated index file for UI components\n\n";
essentialComponents.forEach((component) => {
  const componentName = component.name.replace(".tsx", "");
  indexContent += `export * from "./${componentName}";\n`;
});

fs.writeFileSync(indexPath, indexContent);
console.log("Component index file generated");

console.log("UI components copying completed!");
