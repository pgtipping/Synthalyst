#!/usr/bin/env node

/**
 * Admin Module Migration Script
 *
 * This script helps migrate remaining pages from the old admin structure
 * to the new modular architecture using Next.js route groups.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths
const oldAdminPath = path.join(__dirname, "../src/app/admin");
const newAdminPath = path.join(__dirname, "../src/app/(admin)");

// Get list of directories in old admin path
const oldAdminDirs = fs
  .readdirSync(oldAdminPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

console.log("\n🔍 Found the following directories to migrate:");
console.log(oldAdminDirs.map((dir) => `  - ${dir}`).join("\n"));

// Create destination directories
oldAdminDirs.forEach((dir) => {
  const destDir = path.join(newAdminPath, dir);

  // Skip if directory already exists
  if (fs.existsSync(destDir)) {
    console.log(`\n⚠️  Directory already exists: ${dir}`);
    return;
  }

  try {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`\n✅ Created directory: ${dir}`);

    // Copy files from old directory to new directory
    const sourceDir = path.join(oldAdminPath, dir);
    const files = fs.readdirSync(sourceDir);

    files.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);

      fs.copyFileSync(sourcePath, destPath);
      console.log(`  - Copied: ${file}`);
    });

    // Update imports in files to use the new module structure
    files
      .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
      .forEach((file) => {
        const filePath = path.join(destDir, file);
        let content = fs.readFileSync(filePath, "utf8");

        // Replace absolute imports with relative imports for admin components
        content = content.replace(/from ["']@\/app\/admin\//g, 'from "../');

        // Update AdminLayout import if present
        content = content.replace(
          /import AdminLayout from ["']@\/components\/admin\/AdminLayout["']/g,
          'import { AdminLayout } from "../components"'
        );

        // Save changes
        fs.writeFileSync(filePath, content);
        console.log(`  - Updated imports: ${file}`);
      });
  } catch (error) {
    console.error(`\n❌ Error processing ${dir}:`, error.message);
  }
});

console.log("\n🎉 Migration completed!");
console.log("\nNext steps:");
console.log("1. Check for any import errors in the migrated files");
console.log("2. Update components to use AdminDashboardWrapper");
console.log("3. Run the application to verify everything works correctly");
console.log("4. Remove the old admin directory after successful migration\n");
