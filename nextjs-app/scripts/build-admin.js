#!/usr/bin/env node

/**
 * Admin Module Build Script
 *
 * This script builds the admin module independently, optimizing the build
 * process for faster deployment and better error isolation.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Log with timestamp
function log(message) {
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  console.log(`[${timestamp}] ${message}`);
}

// Execute command with proper logging
function execute(command, options = {}) {
  log(`Executing: ${command}`);
  try {
    execSync(command, {
      stdio: "inherit",
      ...options,
    });
    return true;
  } catch (error) {
    log(`Error executing command: ${error.message}`);
    return false;
  }
}

// Main build process
async function buildAdminModule() {
  log("Starting admin module build");

  // Clean cache directories for fresh build
  log("Cleaning cache directories");
  try {
    if (fs.existsSync("node_modules/.cache")) {
      execute("rm -rf node_modules/.cache");
    }
  } catch (error) {
    log(`Warning: Cache cleaning errors - ${error.message}`);
    // Continue despite cache cleaning errors
  }

  // Verify dependencies
  log("Verifying dependencies");
  if (!fs.existsSync("node_modules/@radix-ui/react-dropdown-menu")) {
    log("Installing missing dependencies");
    execute("npm install --save @radix-ui/react-dropdown-menu");
  }

  // Generate Prisma client if needed
  log("Generating Prisma client");
  if (fs.existsSync("prisma/schema.prisma")) {
    execute("npx prisma generate");
  } else {
    log("No Prisma schema found, skipping client generation");
  }

  // Create temporary .env.local for admin module build if it doesn't exist
  if (!fs.existsSync(".env.local")) {
    log("Creating temporary .env.local for build");
    fs.writeFileSync(".env.local", "NEXT_PUBLIC_MODULE=admin\n");
  } else {
    // Add/update the module environment variable
    const envContent = fs.readFileSync(".env.local", "utf8");
    if (!envContent.includes("NEXT_PUBLIC_MODULE=")) {
      fs.appendFileSync(".env.local", "\nNEXT_PUBLIC_MODULE=admin\n");
    }
  }

  // Backup existing next.config.js if it exists
  let nextConfigBackup = null;
  if (fs.existsSync("next.config.js")) {
    nextConfigBackup = fs.readFileSync("next.config.js", "utf8");
    log("Backed up existing next.config.js");
  }

  // Create .env.development to set specific build variables
  fs.writeFileSync(".env.development", "BUILD_FOCUS=admin\n");
  log("Created .env.development for admin-focused build");

  // Create temporary next.config.js that filters pages
  log("Creating admin-specific next.config.js");
  const adminNextConfig = `
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    poweredByHeader: false,
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: {
      optimizeCss: true,
    },
    distDir: '.next/admin',
    // Configure the build to skip static generation for non-admin routes
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    staticPageGenerationTimeout: 120,
    onDemandEntries: {
      maxInactiveAge: 10 * 60 * 1000,
      pagesBufferLength: 2,
    },
  };
  
  module.exports = nextConfig;
  `;

  fs.writeFileSync("next.config.js", adminNextConfig);
  log("Created admin-specific next.config.js");

  // Create a temporary script to disable non-admin pages
  log("Creating temporary page filter script");

  // Save current directories and files state
  const adminDirContents = getDirectoryContents("src/app/(admin)");
  const appDirContents = getDirectoryContents("src/app");

  try {
    // Move non-admin directories temporarily to disable them during build
    disableNonAdminPages();

    // Build the Next.js application with focus on admin module
    log("Building Next.js admin module");
    const buildSuccess = execute("npx next build");

    if (buildSuccess) {
      log("Admin module build completed successfully");
      return 0;
    } else {
      log("Admin module build failed");
      return 1;
    }
  } finally {
    // Restore original directory structure
    log("Restoring original directory structure");
    restoreDirectoryStructure(adminDirContents, appDirContents);

    // Restore original next.config.js
    if (nextConfigBackup) {
      fs.writeFileSync("next.config.js", nextConfigBackup);
      log("Restored original next.config.js");
    } else {
      fs.unlinkSync("next.config.js");
      log("Removed temporary next.config.js");
    }

    // Remove temporary .env.development
    if (fs.existsSync(".env.development")) {
      fs.unlinkSync(".env.development");
      log("Removed temporary .env.development");
    }
  }
}

// Helper to get directory contents for backup/restore
function getDirectoryContents(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

// Function to disable non-admin pages during build
function disableNonAdminPages() {
  // Create build-temp directory to store moved items
  if (!fs.existsSync("build-temp")) {
    fs.mkdirSync("build-temp");
  }

  // Move or temporarily disable non-admin routes
  const appDir = "src/app";
  const entries = fs.readdirSync(appDir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip moving the admin directory, layout files, and global styles
    if (
      entry.name === "(admin)" ||
      entry.name === "admin" ||
      entry.name === "layout.tsx" ||
      entry.name === "globals.css" ||
      entry.name === "page.tsx" ||
      entry.name === "error.tsx" ||
      entry.name === "loading.tsx"
    ) {
      continue;
    }

    // Move other directories to build-temp
    if (entry.isDirectory()) {
      const source = path.join(appDir, entry.name);
      const target = path.join("build-temp", entry.name);

      log(`Temporarily moving ${source} to ${target}`);
      fs.renameSync(source, target);
    }
  }
}

// Function to restore directory structure
function restoreDirectoryStructure(adminDirContents, appDirContents) {
  if (fs.existsSync("build-temp")) {
    const tempItems = fs.readdirSync("build-temp", { withFileTypes: true });

    for (const item of tempItems) {
      const source = path.join("build-temp", item.name);
      const target = path.join("src/app", item.name);

      log(`Restoring ${source} to ${target}`);
      fs.renameSync(source, target);
    }

    // Remove the temp directory
    fs.rmdirSync("build-temp");
  }
}

// Run the build process
buildAdminModule()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    log(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
