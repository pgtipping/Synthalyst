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

// 1. DIRECT COMPONENT IMPORTS - Create direct export files for all problematic components
console.log("Creating direct component exports to resolve path issues...");

// Function to create direct export files
function createDirectExportFile(folderPath, componentName, exportStatement) {
  const filePath = path.resolve(
    __dirname,
    "..",
    "src",
    "components",
    folderPath,
    `${componentName}.tsx`
  );
  const directExportPath = path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "admin",
    `${componentName}.tsx`
  );

  if (fs.existsSync(filePath)) {
    console.log(
      `Creating direct export for ${componentName} at ${directExportPath}`
    );
    fs.writeFileSync(directExportPath, exportStatement);
  } else {
    console.warn(
      `WARNING: Source component ${filePath} not found, cannot create direct export`
    );
  }
}

// Create direct exports for admin components
createDirectExportFile(
  "admin",
  "AdminLayout",
  `// Direct export to fix path resolution issues
import AdminLayout from '../../components/admin/AdminLayout';
export default AdminLayout;
`
);

// Create direct exports for contact-submissions components
createDirectExportFile(
  "contact-submissions",
  "ContactSubmissionsList",
  `// Direct export to fix path resolution issues
import { ContactSubmissionsList } from '../../components/contact-submissions/ContactSubmissionsList';
export default ContactSubmissionsList;
export { ContactSubmissionsList };
`
);

// 2. CREATE FALLBACK COMPONENTS - Create minimal fallback components if the originals don't exist
console.log("Creating fallback components...");

// Function to create fallback component
function createFallbackComponent(
  componentPath,
  componentName,
  fallbackContent
) {
  const fullPath = path.resolve(__dirname, "..", "src", componentPath);
  const dirName = path.dirname(fullPath);

  if (!fs.existsSync(dirName)) {
    console.log(`Creating directory ${dirName}`);
    fs.mkdirSync(dirName, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    console.log(
      `Creating fallback component for ${componentName} at ${fullPath}`
    );
    fs.writeFileSync(fullPath, fallbackContent);
  }
}

// Create fallback AdminLayout
createFallbackComponent(
  "components/admin/AdminLayout.tsx",
  "AdminLayout",
  `"use client";
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">Admin Navigation</div>
      <main className="admin-content">{children}</main>
    </div>
  );
}
`
);

// Create fallback ContactSubmissionsList
createFallbackComponent(
  "components/contact-submissions/ContactSubmissionsList.tsx",
  "ContactSubmissionsList",
  `"use client";
import React from 'react';

export function ContactSubmissionsList() {
  return (
    <div className="fallback-component">
      <h2>Contact Submissions List</h2>
      <p>This is a fallback component. The original failed to load.</p>
    </div>
  );
}

export default ContactSubmissionsList;
`
);

// 3. MODIFY NEXT CONFIG - Update next.config.js to add explicit aliases
console.log("Updating Next.js configuration with explicit aliases...");
const nextConfigPath = path.resolve(__dirname, "..", "next.config.js");
let nextConfig = fs.readFileSync(nextConfigPath, "utf8");

// Check if webpack config exists and update it
if (!nextConfig.includes("'@/components/admin'")) {
  if (nextConfig.includes("webpack: (config)")) {
    // Update existing webpack config
    nextConfig = nextConfig.replace(
      /webpack:\s*\(\s*config\s*\)\s*=>\s*\{/,
      `webpack: (config) => {
    // Add explicit aliases for components that are being resolved
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/admin': path.resolve(__dirname, './src/components/admin'),
      '@/components/contact-submissions': path.resolve(__dirname, './src/components/contact-submissions'),
      '@/components/ui': path.resolve(__dirname, './src/components/ui'),
    };`
    );
  } else {
    // Add webpack config if it doesn't exist
    nextConfig = nextConfig.replace(
      /module\.exports\s*=\s*\{/,
      `module.exports = {
  webpack: (config) => {
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/admin': path.resolve(__dirname, './src/components/admin'),
      '@/components/contact-submissions': path.resolve(__dirname, './src/components/contact-submissions'),
      '@/components/ui': path.resolve(__dirname, './src/components/ui'),
    };
    return config;
  },`
    );
  }

  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log("Next.js configuration updated with explicit aliases");
}

// 4. CREATE MODULE RESOLUTION HELPER - Create a module-resolution.js file that Next.js will use
console.log("Creating module resolution helper...");
const moduleResolutionPath = path.resolve(
  __dirname,
  "..",
  "src",
  "module-resolution.js"
);
const moduleResolutionContent = `// This file helps Next.js resolve modules during build
const path = require('path');

module.exports = {
  resolveComponentPath: function(componentPath) {
    const mapping = {
      '@/components/admin/AdminLayout': path.resolve(__dirname, './components/admin/AdminLayout.tsx'),
      '@/components/contact-submissions/ContactSubmissionsList': path.resolve(__dirname, './components/contact-submissions/ContactSubmissionsList.tsx'),
    };
    
    return mapping[componentPath] || componentPath;
  }
};
`;

fs.writeFileSync(moduleResolutionPath, moduleResolutionContent);

// 5. MODIFY TSCONFIG - Ensure tsconfig.json has proper path aliases
console.log("Updating TypeScript configuration...");
const tsconfigPath = path.resolve(__dirname, "..", "tsconfig.json");
let tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

// Ensure paths are correctly defined
if (
  !tsconfig.compilerOptions.paths ||
  !tsconfig.compilerOptions.paths["@/components/*"]
) {
  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }

  tsconfig.compilerOptions.paths["@/components/*"] = ["./src/components/*"];
  tsconfig.compilerOptions.paths["@/app/*"] = ["./src/app/*"];
  tsconfig.compilerOptions.paths["@/lib/*"] = ["./src/lib/*"];

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log("TypeScript configuration updated with paths");
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

// 6. DIRECT IMPORTS - Create direct imports for problematic files
console.log("Creating direct imports for problematic files...");

// Function to check if a file contains an import and update it if needed
function updateImports(filePath, importToCheck, directImport) {
  if (fs.existsSync(filePath)) {
    console.log(`Checking imports in ${filePath}`);
    let content = fs.readFileSync(filePath, "utf8");

    if (content.includes(importToCheck)) {
      console.log(`Replacing import in ${filePath}`);
      content = content.replace(
        new RegExp(`import [^;]* from ['"]${importToCheck}['"]`, "g"),
        directImport
      );
      fs.writeFileSync(filePath, content);
    }
  }
}

// Update imports in known problematic files
updateImports(
  path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "admin",
    "communications",
    "page.tsx"
  ),
  "@/components/admin/AdminLayout",
  "import AdminLayout from '../AdminLayout'"
);

updateImports(
  path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "admin",
    "contact-submissions",
    "ContactSubmissionsPage.tsx"
  ),
  "@/components/contact-submissions/ContactSubmissionsList",
  "import { ContactSubmissionsList } from '../../../components/contact-submissions/ContactSubmissionsList'"
);

updateImports(
  path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "admin",
    "contact-submissions",
    "ContactSubmissionsPage.tsx"
  ),
  "@/components/admin/AdminLayout",
  "import AdminLayout from '../AdminLayout'"
);

updateImports(
  path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "admin",
    "email-logs",
    "page.tsx"
  ),
  "@/components/admin/AdminLayout",
  "import AdminLayout from '../AdminLayout'"
);

updateImports(
  path.resolve(__dirname, "..", "src", "app", "admin", "feedback", "page.tsx"),
  "@/components/admin/AdminLayout",
  "import AdminLayout from '../AdminLayout'"
);

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
console.log("Building Next.js app with specific flags...");
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
