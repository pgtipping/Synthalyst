#!/usr/bin/env node

/**
 * Component Audit Script
 *
 * This script analyzes the component usage across the codebase.
 * It helps identify which components are used where and how often.
 *
 * Usage:
 * node scripts/component-audit.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const componentsDir = path.join(srcDir, "components/ui");

// Get all component files
const componentFiles = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".tsx"));

console.log(`Found ${componentFiles.length} components to audit`);

// Extract component names
const componentNames = componentFiles.map((file) => {
  return path.basename(file, ".tsx");
});

// Find all files that might use the components
const allTsxFiles = getAllFiles(srcDir, ".tsx");
const allTsFiles = getAllFiles(srcDir, ".ts");
const allFiles = [...allTsxFiles, ...allTsFiles].filter(
  (file) => !file.includes("/components/ui/")
);

console.log(`Found ${allFiles.length} files to check for component usage`);

// Track component usage
const componentUsage = {};
componentNames.forEach((name) => {
  componentUsage[name] = {
    count: 0,
    files: [],
  };
});

// Check each file for component usage
allFiles.forEach((file) => {
  const code = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(rootDir, file);

  componentNames.forEach((name) => {
    // Check for import statements
    const importRegex = new RegExp(
      `import\\s+{[^}]*\\b${name}\\b[^}]*}\\s+from\\s+["']@/components/ui["']`,
      "g"
    );
    const importMatches = code.match(importRegex);

    // Check for JSX usage
    const jsxRegex = new RegExp(`<${name}[\\s/>]`, "g");
    const jsxMatches = code.match(jsxRegex);

    const totalMatches =
      (importMatches?.length || 0) + (jsxMatches?.length || 0);

    if (totalMatches > 0) {
      componentUsage[name].count += totalMatches;
      componentUsage[name].files.push(relativePath);
    }
  });
});

// Sort components by usage
const sortedComponents = Object.entries(componentUsage).sort(
  (a, b) => b[1].count - a[1].count
);

// Print results
console.log("\nComponent Usage Report:");
console.log("======================\n");

sortedComponents.forEach(([name, usage]) => {
  console.log(`${name}: ${usage.count} usages in ${usage.files.length} files`);

  if (usage.files.length > 0) {
    console.log("  Files:");
    usage.files.forEach((file) => {
      console.log(`    - ${file}`);
    });
  }

  console.log("");
});

// Print summary
const totalUsage = sortedComponents.reduce(
  (sum, [_, usage]) => sum + usage.count,
  0
);
const unusedComponents = sortedComponents.filter(
  ([_, usage]) => usage.count === 0
);

console.log("Summary:");
console.log(`Total components: ${componentNames.length}`);
console.log(`Total usages: ${totalUsage}`);
console.log(`Unused components: ${unusedComponents.length}`);

if (unusedComponents.length > 0) {
  console.log("\nUnused Components:");
  unusedComponents.forEach(([name]) => {
    console.log(`  - ${name}`);
  });
}

/**
 * Gets all files with a specific extension in a directory and its subdirectories
 */
function getAllFiles(dir, ext) {
  let files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Skip node_modules
      if (item === "node_modules") {
        continue;
      }

      // Recursively get files from subdirectories
      files = files.concat(getAllFiles(itemPath, ext));
    } else if (item.endsWith(ext)) {
      files.push(itemPath);
    }
  }

  return files;
}
