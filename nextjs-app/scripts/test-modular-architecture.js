#!/usr/bin/env node

/**
 * Modular Architecture Test Script
 *
 * This script helps test the modular architecture implementation by:
 * 1. Checking that all expected files exist in the new structure
 * 2. Validating import paths
 * 3. Ensuring aliases are properly configured
 */

const fs = require("fs");
const path = require("path");
const chalk = require("chalk"); // You may need to install this with npm

// Define paths
const ROOT_DIR = path.resolve(__dirname, "..");
const ADMIN_COMPONENTS_PATH = path.resolve(
  ROOT_DIR,
  "src/app/(admin)/components"
);
const ADMIN_STYLES_PATH = path.resolve(ROOT_DIR, "src/app/(admin)/styles");

// Define expected files
const EXPECTED_FILES = [
  // Admin layout components
  "src/app/(admin)/components/AdminLayout.tsx",
  "src/app/(admin)/components/Breadcrumb.tsx",
  "src/app/(admin)/components/AdminDashboardWrapper.tsx",

  // Admin styles
  "src/app/(admin)/styles/admin.css",

  // Admin pages
  "src/app/(admin)/page.tsx",
  "src/app/(admin)/layout.tsx",

  // Config files
  "src/redirects.ts",
];

// Define expected import patterns
const IMPORT_PATTERNS = [
  {
    pattern: /from\s+["']@\/app\/\(admin\)\/components["']/g,
    description: "Direct imports from admin components directory",
  },
  {
    pattern: /from\s+["']@\/admin\/components["']/g,
    description: "Aliased imports using @/admin/components",
  },
];

// Colors for output
const SUCCESS = chalk.green;
const ERROR = chalk.red;
const INFO = chalk.blue;
const WARN = chalk.yellow;

/**
 * Check if expected files exist
 */
function checkExpectedFiles() {
  console.log(INFO("Checking for expected files..."));
  let missingFiles = 0;

  EXPECTED_FILES.forEach((file) => {
    const filePath = path.resolve(ROOT_DIR, file);

    if (fs.existsSync(filePath)) {
      console.log(SUCCESS(`✓ ${file}`));
    } else {
      console.log(ERROR(`✗ ${file}`));
      missingFiles++;
    }
  });

  if (missingFiles === 0) {
    console.log(SUCCESS("\nAll expected files found!\n"));
  } else {
    console.log(ERROR(`\n${missingFiles} files missing!\n`));
  }

  return missingFiles === 0;
}

/**
 * Check for import patterns in a directory
 */
function checkImportPatterns(dir) {
  console.log(INFO(`Scanning imports in ${dir}...`));
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      checkImportPatterns(filePath);
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      const content = fs.readFileSync(filePath, "utf8");

      IMPORT_PATTERNS.forEach(({ pattern, description }) => {
        if (pattern.test(content)) {
          console.log(SUCCESS(`✓ ${filePath}: Found ${description}`));
          // Reset pattern's lastIndex
          pattern.lastIndex = 0;
        }
      });
    }
  });
}

/**
 * Check next.config.js for aliases
 */
function checkNextConfig() {
  console.log(INFO("Checking Next.js config for module aliases..."));
  const configPath = path.resolve(ROOT_DIR, "next.config.js");

  if (!fs.existsSync(configPath)) {
    console.log(ERROR("✗ next.config.js not found!"));
    return false;
  }

  const content = fs.readFileSync(configPath, "utf8");

  if (content.includes("@/admin/components")) {
    console.log(SUCCESS("✓ @/admin/components alias found"));
  } else {
    console.log(ERROR("✗ @/admin/components alias not found"));
  }

  if (content.includes("@/admin/styles")) {
    console.log(SUCCESS("✓ @/admin/styles alias found"));
  } else {
    console.log(ERROR("✗ @/admin/styles alias not found"));
  }

  return true;
}

/**
 * Run all tests
 */
function runTests() {
  console.log(INFO("\n=== MODULAR ARCHITECTURE TEST REPORT ===\n"));

  const filesExist = checkExpectedFiles();

  console.log(INFO("\n=== CHECKING IMPORT PATTERNS ===\n"));

  checkImportPatterns(path.resolve(ROOT_DIR, "src"));

  console.log(INFO("\n=== CHECKING NEXT.JS CONFIG ===\n"));

  const configCorrect = checkNextConfig();

  console.log(INFO("\n=== TEST SUMMARY ===\n"));

  if (filesExist && configCorrect) {
    console.log(
      SUCCESS(
        "All tests passed! The modular architecture seems to be set up correctly."
      )
    );
  } else {
    console.log(ERROR("Some tests failed. Please check the issues above."));
  }
}

// Run the tests
runTests();
