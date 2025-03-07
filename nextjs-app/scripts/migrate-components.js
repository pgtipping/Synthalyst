#!/usr/bin/env node

/**
 * Migrate Components Script
 *
 * This script helps migrate components from one directory structure to another.
 * It's particularly useful for reorganizing component libraries.
 *
 * Usage:
 * node scripts/migrate-components.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const oldComponentsDir = path.join(srcDir, "components");
const newComponentsDir = path.join(srcDir, "components/ui");

// Ensure the new directory exists
if (!fs.existsSync(newComponentsDir)) {
  fs.mkdirSync(newComponentsDir, { recursive: true });
}

// Get all component files
const componentFiles = fs
  .readdirSync(oldComponentsDir)
  .filter((file) => file.endsWith(".tsx") && !file.includes("ui/"));

console.log(`Found ${componentFiles.length} components to migrate`);

// Process each component
componentFiles.forEach((file) => {
  const oldPath = path.join(oldComponentsDir, file);
  const newPath = path.join(newComponentsDir, file);

  // Skip if the file is a directory
  if (fs.statSync(oldPath).isDirectory()) {
    return;
  }

  console.log(`Migrating ${file}...`);

  // Read the component file
  let componentCode = fs.readFileSync(oldPath, "utf8");

  // Update imports
  componentCode = updateImports(componentCode);

  // Write the updated code to the new location
  fs.writeFileSync(newPath, componentCode);

  console.log(`✅ Migrated ${file} to ${newPath}`);
});

console.log("Migration complete!");

/**
 * Updates import paths in the component code
 */
function updateImports(code) {
  // Update relative imports
  let updatedCode = code.replace(
    /from\s+["']\.\/([^"']+)["']/g,
    'from "../$1"'
  );

  // Update imports from the components directory
  updatedCode = updatedCode.replace(
    /from\s+["']@\/components\/([^"'\/]+)["']/g,
    'from "@/components/ui/$1"'
  );

  return updatedCode;
}

// Find all files that might reference the components
const allTsxFiles = getAllFiles(srcDir, ".tsx");
const allTsFiles = getAllFiles(srcDir, ".ts");
const allFiles = [...allTsxFiles, ...allTsFiles];

console.log(`Found ${allFiles.length} files to update references in`);

// Update references in all files
allFiles.forEach((file) => {
  // Skip the component files themselves
  if (file.includes("/components/ui/")) {
    return;
  }

  // Read the file
  let code = fs.readFileSync(file, "utf8");
  let originalCode = code;

  // Update imports
  code = code.replace(
    /from\s+["']@\/components\/([^"'\/]+)["']/g,
    'from "@/components/ui/$1"'
  );

  // Only write if changes were made
  if (code !== originalCode) {
    fs.writeFileSync(file, code);
    console.log(`Updated imports in ${file}`);
  }
});

console.log("Reference updates complete!");

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
