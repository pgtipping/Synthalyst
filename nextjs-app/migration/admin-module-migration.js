/**
 * Admin Module Migration Script
 *
 * This script helps with the migration of the Admin components and pages to the new modular structure
 * using the Next.js route groups feature. It identifies potential conflicts and provides guidance
 * on how to resolve them.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Define paths
const OLD_ADMIN_COMPONENTS_PATH = path.resolve(
  __dirname,
  "../src/components/admin"
);
const NEW_ADMIN_COMPONENTS_PATH = path.resolve(
  __dirname,
  "../src/app/(admin)/components"
);
const OLD_ADMIN_PAGES_PATH = path.resolve(__dirname, "../src/app/admin");
const NEW_ADMIN_PAGES_PATH = path.resolve(__dirname, "../src/app/(admin)");

// Ensure directories exist
if (!fs.existsSync(NEW_ADMIN_COMPONENTS_PATH)) {
  fs.mkdirSync(NEW_ADMIN_COMPONENTS_PATH, { recursive: true });
}

// Function to find imports that need to be updated
function findImportsToUpdate() {
  console.log("Scanning for imports that need to be updated...");

  // Search for imports of admin components
  const files = glob.sync("nextjs-app/src/**/*.{js,jsx,ts,tsx}");
  const importMatches = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    const importRegex =
      /import\s+(?:(?:{[^}]*})|(?:\w+))\s+from\s+["']@\/components\/admin\/([^"']+)["']/g;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      importMatches.push({
        file,
        importPath: match[0],
        component: match[1],
      });
    }
  });

  console.log(`Found ${importMatches.length} imports that need to be updated`);

  importMatches.forEach((match) => {
    console.log(`- ${match.file}: ${match.importPath}`);
  });

  return importMatches;
}

// Function to check for hardcoded admin routes
function findHardcodedRoutes() {
  console.log("\nScanning for hardcoded admin routes...");

  const files = glob.sync("nextjs-app/src/**/*.{js,jsx,ts,tsx}");
  const routeMatches = [];

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");

    // Look for href="/admin" or similar patterns
    const routeRegex = /href=["']\/admin(?:\/[^"']*)?["']/g;

    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      routeMatches.push({
        file,
        route: match[0],
      });
    }

    // Look for router.push('/admin') or similar patterns
    const routerPushRegex =
      /(?:router|navigation)\.(?:push|replace)\(["']\/admin(?:\/[^"']*)?["']\)/g;

    while ((match = routerPushRegex.exec(content)) !== null) {
      routeMatches.push({
        file,
        route: match[0],
      });
    }
  });

  console.log(`Found ${routeMatches.length} hardcoded admin routes`);

  routeMatches.forEach((match) => {
    console.log(`- ${match.file}: ${match.route}`);
  });

  return routeMatches;
}

// Function to identify components that need to be migrated
function identifyComponentsToMigrate() {
  console.log("\nIdentifying admin components that need to be migrated...");

  const adminComponents = glob.sync(
    `${OLD_ADMIN_COMPONENTS_PATH}/**/*.{jsx,tsx}`
  );

  console.log(`Found ${adminComponents.length} admin components to migrate`);

  adminComponents.forEach((component) => {
    const relativePath = path.relative(OLD_ADMIN_COMPONENTS_PATH, component);
    console.log(`- ${relativePath}`);
  });

  return adminComponents;
}

// Function to identify pages that need to be migrated
function identifyPagesToMigrate() {
  console.log("\nIdentifying admin pages that need to be migrated...");

  const adminPages = glob.sync(`${OLD_ADMIN_PAGES_PATH}/**/*.{jsx,tsx}`);

  console.log(`Found ${adminPages.length} admin pages to migrate`);

  adminPages.forEach((page) => {
    const relativePath = path.relative(OLD_ADMIN_PAGES_PATH, page);
    console.log(`- ${relativePath}`);
  });

  return adminPages;
}

// Main function to run the migration check
async function runMigrationCheck() {
  console.log("=== ADMIN MODULE MIGRATION ANALYSIS ===\n");

  const importsToUpdate = findImportsToUpdate();
  const hardcodedRoutes = findHardcodedRoutes();
  const componentsToMigrate = identifyComponentsToMigrate();
  const pagesToMigrate = identifyPagesToMigrate();

  console.log("\n=== MIGRATION STEPS ===");
  console.log(
    "1. Update the import paths in all files that import admin components"
  );
  console.log("2. Migrate all admin components to the new path structure");
  console.log(
    "3. Ensure all admin pages are properly placed in the new route group"
  );
  console.log("4. Check for any hardcoded routes that might need updating");
  console.log("5. Update the middleware to handle any redirects if needed");

  console.log("\n=== POTENTIAL CONFLICTS ===");

  if (importsToUpdate.length > 0) {
    console.log(
      `- ${importsToUpdate.length} import statements need to be updated`
    );
  }

  if (hardcodedRoutes.length > 0) {
    console.log(
      `- ${hardcodedRoutes.length} hardcoded routes might need attention`
    );
  }

  console.log(
    '\nNote: Next.js route groups are transparent in URLs, so "/admin" will still work without redirect'
  );
  console.log(
    "      But component imports need to be updated to the new path structure."
  );
}

// Run the migration check
runMigrationCheck().catch(console.error);
