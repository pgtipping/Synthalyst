#!/usr/bin/env node

/**
 * Component Audit Script
 *
 * This script scans the codebase for custom components and styling patterns
 * that could be replaced with shadcn/ui components.
 *
 * Usage:
 * node scripts/component-audit.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "nextjs-app/src");
const componentsDir = path.join(srcDir, "components/ui");
const appDir = path.join(srcDir, "app");

// Patterns to look for
const patterns = {
  customAlerts: /className=.*bg-(amber|red|green|blue)-50.*border.*rounded/g,
  directColorClasses: /className=.*bg-(amber|red|green|blue)-[0-9]+/g,
  gradients: /className=.*bg-gradient-to-r/g,
  customToasts: /import.*from "sonner"/g,
  missingCn: /className={\`.*\$\{.*\}.*\`}/g,
};

// shadcn/ui components to check for
const shadcnComponents = [
  "alert",
  "toast",
  "card",
  "badge",
  "button",
  "dialog",
  "dropdown-menu",
  "form",
  "input",
  "label",
  "popover",
  "select",
  "tabs",
  "textarea",
];

// Get installed shadcn/ui components
const installedComponents = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(".tsx", ""));

console.log("=== Synthalyst Component Audit ===\n");

// Check for missing shadcn/ui components
console.log("Missing shadcn/ui components:");
const missingComponents = shadcnComponents.filter(
  (comp) => !installedComponents.includes(comp)
);
if (missingComponents.length === 0) {
  console.log("✅ All recommended shadcn/ui components are installed.");
} else {
  console.log("❌ Missing components:");
  missingComponents.forEach((comp) => {
    console.log(`  - ${comp} (install with: npx shadcn@latest add ${comp})`);
  });
}
console.log();

// Function to scan files recursively
function scanFiles(dir, patterns, results = {}) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanFiles(filePath, patterns, results);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(rootDir, filePath);

      Object.entries(patterns).forEach(([patternName, pattern]) => {
        const matches = content.match(pattern);
        if (matches) {
          if (!results[patternName]) {
            results[patternName] = [];
          }
          results[patternName].push({
            file: relativePath,
            count: matches.length,
          });
        }
      });
    }
  });

  return results;
}

// Scan app directory
console.log("Scanning for custom components and styling patterns...");
const results = scanFiles(appDir, patterns);

// Display results
console.log("\nResults:\n");

if (Object.keys(results).length === 0) {
  console.log(
    "✅ No custom components or styling patterns found that need attention."
  );
} else {
  Object.entries(results).forEach(([patternName, files]) => {
    console.log(`${patternName}:`);
    files.forEach(({ file, count }) => {
      console.log(`  - ${file} (${count} occurrences)`);
    });
    console.log();
  });

  // Recommendations
  console.log("Recommendations:");

  if (results.customAlerts) {
    console.log(
      "- Replace custom alert styles with the shadcn/ui Alert component"
    );
  }

  if (results.directColorClasses) {
    console.log(
      "- Use shadcn/ui theming system instead of direct color classes"
    );
  }

  if (results.gradients) {
    console.log("- Consider creating variants for common gradient patterns");
  }

  if (results.customToasts) {
    console.log(
      '- Use the toast migration utility instead of importing directly from "sonner"'
    );
  }

  if (results.missingCn) {
    console.log(
      "- Use the cn utility for class merging instead of template literals"
    );
  }
}

console.log("\n=== Audit Complete ===");
