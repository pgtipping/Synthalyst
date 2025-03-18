/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Clean cache and build artifacts
console.log("Cleaning cache and build artifacts...");
execSync("rm -rf node_modules/.cache .next", { stdio: "inherit" });

// Verify environment variables
console.log("Verifying environment variables...");
try {
  execSync("node scripts/verify-env.js", { stdio: "inherit" });
} catch (err) {
  console.warn(
    "Environment verification completed with warnings - continuing build"
  );
  console.warn(`Error details: ${err.message}`);
}

// Install critical dependencies directly
console.log("Installing critical dependencies...");
execSync(
  "npm install --save @tailwindcss/postcss@4.0.14 clsx@2.1.1 tailwind-merge@3.0.2 @radix-ui/react-slot@1.1.2 @radix-ui/react-tabs@1.1.3",
  { stdio: "inherit" }
);

// Ensure PostCSS is properly configured
console.log("Verifying PostCSS configuration...");
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

// Function to create index files for component directories
function createComponentIndex(
  componentDir,
  componentName,
  defaultExport = false
) {
  const dirPath = path.resolve(
    __dirname,
    "..",
    "src",
    "components",
    componentDir
  );
  const indexPath = path.join(dirPath, "index.ts");

  if (fs.existsSync(dirPath)) {
    console.log(`Creating ${componentDir} components index file...`);

    // Get all component files
    const componentFiles = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".tsx") && !file.startsWith("index"));

    let indexContent = "";

    // Handle the main component specifically
    if (componentName && componentFiles.includes(`${componentName}.tsx`)) {
      if (defaultExport) {
        indexContent += `export { default } from './${componentName}';\n`;
      }
      indexContent += `export { default as ${componentName} } from './${componentName}';\n`;

      // Add other exports
      componentFiles.forEach((file) => {
        if (file !== `${componentName}.tsx`) {
          const name = file.replace(".tsx", "");
          const fileContent = fs.readFileSync(path.join(dirPath, file), "utf8");

          if (fileContent.includes("export default")) {
            indexContent += `export { default as ${name} } from './${name}';\n`;
          } else {
            indexContent += `export * from './${name}';\n`;
          }
        }
      });
    } else {
      // Fallback to generic exports
      indexContent = componentFiles
        .map((file) => {
          const name = file.replace(".tsx", "");
          return `export * from './${name}';`;
        })
        .join("\n");
    }

    fs.writeFileSync(indexPath, indexContent);
    console.log(`${componentDir} components index file created successfully`);
  } else {
    console.warn(`${dirPath} does not exist, skipping index file creation`);
  }
}

// Create index files for key component directories
createComponentIndex("admin", "AdminLayout", true);
createComponentIndex("contact-submissions", "ContactSubmissionsList", false);
createComponentIndex("ui", null, false);

// Also create a direct AdminLayout.tsx in src/components if it doesn't exist
const adminLayoutPath = path.resolve(
  __dirname,
  "..",
  "src",
  "components",
  "AdminLayout.tsx"
);
const sourceAdminLayoutPath = path.resolve(
  __dirname,
  "..",
  "src",
  "components",
  "admin",
  "AdminLayout.tsx"
);

if (!fs.existsSync(adminLayoutPath) && fs.existsSync(sourceAdminLayoutPath)) {
  console.log(
    "Creating AdminLayout.tsx in src/components for direct imports..."
  );
  const content = `// Re-export AdminLayout from admin directory
export { default } from './admin/AdminLayout';
`;
  fs.writeFileSync(adminLayoutPath, content);
}

// Create web pack alias file to ensure path resolution works correctly
console.log("Creating webpack aliases configuration...");
const nextConfigPath = path.resolve(__dirname, "..", "next.config.js");
const nextConfigContent = fs.readFileSync(nextConfigPath, "utf8");

if (!nextConfigContent.includes("'@/components/admin'")) {
  console.log("Adding explicit component aliases to next.config.js...");

  const updatedConfig = nextConfigContent.replace(
    /webpack: \(config\) => \{/,
    `webpack: (config) => {
    // Add explicit aliases for components that are being resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/admin': path.resolve(__dirname, './src/components/admin'),
      '@/components/contact-submissions': path.resolve(__dirname, './src/components/contact-submissions'),
      '@/components/ui': path.resolve(__dirname, './src/components/ui'),
    };`
  );

  fs.writeFileSync(nextConfigPath, updatedConfig);
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
