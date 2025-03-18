const { execSync } = require("child_process");

// Clean cache and build artifacts
console.log("Cleaning cache and build artifacts...");
execSync("rm -rf node_modules/.cache .next", { stdio: "inherit" });

// Install critical dependencies directly
console.log("Installing critical dependencies...");
execSync(
  "npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2 @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3",
  { stdio: "inherit" }
);

// Ensure PostCSS is properly configured
console.log("Verifying PostCSS configuration...");
const fs = require("fs");
const path = require("path");
const postcssConfigPath = path.resolve(__dirname, "..", "postcss.config.cjs");
const postcssConfig = fs.readFileSync(postcssConfigPath, "utf8");
if (!postcssConfig.includes("@tailwindcss/postcss")) {
  console.log("Updating PostCSS configuration...");
  const updatedConfig = postcssConfig
    .replace(/tailwindcss\s*:\s*\{\}/g, '"@tailwindcss/postcss": {}')
    .replace(/"tailwindcss"\s*:\s*\{\}/g, '"@tailwindcss/postcss": {}')
    .replace(/'tailwindcss'\s*:\s*\{\}/g, '"@tailwindcss/postcss": {}');
  fs.writeFileSync(postcssConfigPath, updatedConfig);
}

// Create an explicit index export file for admin components
const adminComponentsDir = path.resolve(__dirname, "../src/components/admin");
const adminIndexPath = path.join(adminComponentsDir, "index.ts");
if (fs.existsSync(adminComponentsDir)) {
  console.log("Creating admin components index file...");
  const adminFiles = fs
    .readdirSync(adminComponentsDir)
    .filter((file) => file.endsWith(".tsx") && !file.startsWith("index"));

  const exportStatements = adminFiles
    .map((file) => {
      const componentName = file.replace(".tsx", "");
      return `export * from './${componentName}';`;
    })
    .join("\n");

  fs.writeFileSync(adminIndexPath, exportStatements);
  console.log("Admin components index file created successfully");
}

// Similar approach for contact-submissions
const contactSubmissionsDir = path.resolve(
  __dirname,
  "../src/components/contact-submissions"
);
const contactSubmissionsIndexPath = path.join(
  contactSubmissionsDir,
  "index.ts"
);
if (fs.existsSync(contactSubmissionsDir)) {
  console.log("Creating contact-submissions components index file...");
  const contactFiles = fs
    .readdirSync(contactSubmissionsDir)
    .filter((file) => file.endsWith(".tsx") && !file.startsWith("index"));

  const exportStatements = contactFiles
    .map((file) => {
      const componentName = file.replace(".tsx", "");
      return `export * from './${componentName}';`;
    })
    .join("\n");

  fs.writeFileSync(contactSubmissionsIndexPath, exportStatements);
  console.log("Contact-submissions components index file created successfully");
}

// Temporarily move babel config files
if (fs.existsSync(path.resolve(__dirname, "../.babelrc"))) {
  console.log("Temporarily moving Babel configuration files...");
  fs.renameSync(
    path.resolve(__dirname, "../.babelrc"),
    path.resolve(__dirname, "../.babelrc.backup")
  );
}

if (fs.existsSync(path.resolve(__dirname, "../babel.config.js"))) {
  fs.renameSync(
    path.resolve(__dirname, "../babel.config.js"),
    path.resolve(__dirname, "../babel.config.js.backup")
  );
}

// Generate Prisma client
console.log("Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit" });

// Handle database setup for build
console.log("Handling database setup...");
execSync("node scripts/handle-db-build.js", { stdio: "inherit" });

// Build Next.js app
console.log("Building Next.js app...");
execSync("npx next build", { stdio: "inherit" });

// Restore babel config files
console.log("Restoring Babel configuration files...");
if (fs.existsSync(path.resolve(__dirname, "../.babelrc.backup"))) {
  fs.renameSync(
    path.resolve(__dirname, "../.babelrc.backup"),
    path.resolve(__dirname, "../.babelrc")
  );
}

if (fs.existsSync(path.resolve(__dirname, "../babel.config.js.backup"))) {
  fs.renameSync(
    path.resolve(__dirname, "../babel.config.js.backup"),
    path.resolve(__dirname, "../babel.config.js")
  );
}

console.log("Build completed successfully");
