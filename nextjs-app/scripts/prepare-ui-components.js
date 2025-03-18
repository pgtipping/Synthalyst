const fs = require("fs");
const path = require("path");

console.log("Preparing UI components for build...");

// Ensure the components/ui directory exists
const uiDir = path.resolve(__dirname, "../src/components/ui");
if (!fs.existsSync(uiDir)) {
  console.log("Creating components/ui directory...");
  fs.mkdirSync(uiDir, { recursive: true });
}

// Check if .npmrc has the correct configuration
const npmrcPath = path.resolve(__dirname, "../.npmrc");
const desiredNpmrcContent =
  "public-hoist-pattern[]=*tailwindcss*\npublic-hoist-pattern[]=*postcss*\n";

if (
  !fs.existsSync(npmrcPath) ||
  fs.readFileSync(npmrcPath, "utf8") !== desiredNpmrcContent
) {
  console.log("Updating .npmrc file...");
  fs.writeFileSync(npmrcPath, desiredNpmrcContent);
}

// Check if shadcn components were installed
const componentsJsonPath = path.resolve(__dirname, "../components.json");
if (fs.existsSync(componentsJsonPath)) {
  console.log("components.json exists, ensuring aliases are correctly set...");
  const componentsJson = JSON.parse(
    fs.readFileSync(componentsJsonPath, "utf8")
  );

  // Ensure aliases are correctly set
  if (
    !componentsJson.aliases ||
    componentsJson.aliases.components !== "@/components"
  ) {
    componentsJson.aliases = {
      ...componentsJson.aliases,
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    };

    fs.writeFileSync(
      componentsJsonPath,
      JSON.stringify(componentsJson, null, 2)
    );
  }
}

// Create a temporary utils file if it doesn't exist (required by shadcn components)
const utilsPath = path.resolve(__dirname, "../src/lib/utils.ts");
if (!fs.existsSync(utilsPath)) {
  console.log("Creating temporary utils.ts file...");
  const utilsDir = path.dirname(utilsPath);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

  fs.writeFileSync(utilsPath, utilsContent);
}

console.log("UI components preparation complete!");
