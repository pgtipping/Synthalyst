#!/usr/bin/env node

/**
 * Component Migration Script
 *
 * This script helps migrate custom components to shadcn/ui components.
 * It identifies components that need to be migrated and provides guidance on how to do it.
 *
 * Usage:
 * node scripts/migrate-components.js [component-name]
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "nextjs-app/src");
const componentsDir = path.join(srcDir, "components");
const shadcnDir = path.join(componentsDir, "ui");

// Component mappings (custom component -> shadcn/ui component)
const componentMappings = {
  Alert: "alert",
  Button: "button",
  Card: "card",
  Dialog: "dialog",
  Dropdown: "dropdown-menu",
  Input: "input",
  Label: "label",
  Select: "select",
  Tabs: "tabs",
  Textarea: "textarea",
  Toast: "toast",
};

// Migration templates
const migrationTemplates = {
  alert: {
    import: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";`,
    usage: `<Alert>
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>`,
  },
  button: {
    import: `import { Button } from "@/components/ui/button";`,
    usage: `<Button variant="default">Button Text</Button>`,
  },
  card: {
    import: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";`,
    usage: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>`,
  },
};

// Get component name from command line arguments
const componentName = process.argv[2];

// If no component name is provided, show usage
if (!componentName) {
  console.log("Usage: node scripts/migrate-components.js [component-name]");
  console.log("\nAvailable components to migrate:");
  Object.entries(componentMappings).forEach(([custom, shadcn]) => {
    console.log(`  - ${custom} -> ${shadcn}`);
  });
  process.exit(0);
}

console.log(`=== Migrating ${componentName} to shadcn/ui ===\n`);

// Check if the component mapping exists
const shadcnComponent = componentMappings[componentName];
if (!shadcnComponent) {
  console.log(`❌ No mapping found for ${componentName}.`);
  console.log("Available components to migrate:");
  Object.entries(componentMappings).forEach(([custom, shadcn]) => {
    console.log(`  - ${custom} -> ${shadcn}`);
  });
  process.exit(1);
}

// Check if the shadcn/ui component is installed
const isShadcnComponentInstalled = fs.existsSync(
  path.join(shadcnDir, `${shadcnComponent}.tsx`)
);
if (!isShadcnComponentInstalled) {
  console.log(
    `❌ The shadcn/ui ${shadcnComponent} component is not installed.`
  );
  console.log(`Run the following command to install it:`);
  console.log(`  npx shadcn@latest add ${shadcnComponent}`);
  process.exit(1);
}

// Find custom component files
const customComponentFiles = [];
function findComponentFiles(dir, componentName) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findComponentFiles(filePath, componentName);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      const content = fs.readFileSync(filePath, "utf8");
      if (
        content.includes(`export const ${componentName}`) ||
        content.includes(`export function ${componentName}`) ||
        content.includes(`export default function ${componentName}`)
      ) {
        customComponentFiles.push(filePath);
      }
    }
  });
}

findComponentFiles(componentsDir, componentName);

if (customComponentFiles.length === 0) {
  console.log(`❌ No custom ${componentName} component files found.`);
  process.exit(1);
}

console.log(
  `Found ${customComponentFiles.length} custom ${componentName} component files:`
);
customComponentFiles.forEach((file) => {
  console.log(`  - ${path.relative(rootDir, file)}`);
});

// Find files that import the custom component
const importingFiles = [];
function findImportingFiles(dir, componentName, componentFiles) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImportingFiles(filePath, componentName, componentFiles);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      // Skip the component files themselves
      if (componentFiles.includes(filePath)) {
        return;
      }

      const content = fs.readFileSync(filePath, "utf8");
      const importRegex = new RegExp(
        `import.*{.*${componentName}.*}.*from`,
        "g"
      );
      if (importRegex.test(content)) {
        importingFiles.push(filePath);
      }
    }
  });
}

findImportingFiles(srcDir, componentName, customComponentFiles);

console.log(
  `\nFound ${importingFiles.length} files that import the custom ${componentName} component:`
);
importingFiles.forEach((file) => {
  console.log(`  - ${path.relative(rootDir, file)}`);
});

// Migration guidance
console.log("\n=== Migration Steps ===");

console.log("\n1. Install the shadcn/ui component (if not already installed):");
console.log(`   npx shadcn@latest add ${shadcnComponent}`);

console.log("\n2. Update imports in files that use the component:");
console.log(
  `   Replace: import { ${componentName} } from "@/components/[path-to-custom-component]";`
);
console.log(
  `   With:    ${
    migrationTemplates[shadcnComponent]?.import ||
    `import { ... } from "@/components/ui/${shadcnComponent}";`
  }`
);

console.log("\n3. Update component usage:");
if (migrationTemplates[shadcnComponent]?.usage) {
  console.log(`   Example usage:\n`);
  console.log(`   ${migrationTemplates[shadcnComponent].usage}`);
} else {
  console.log(
    `   Refer to the shadcn/ui documentation for ${shadcnComponent} usage.`
  );
}

console.log("\n4. Check for prop differences:");
console.log(
  "   - The shadcn/ui component may have different props than your custom component."
);
console.log("   - You may need to adapt your code to use the new props.");

console.log("\n5. Update styling:");
console.log("   - Use the shadcn/ui theming system for styling.");
console.log("   - Avoid direct Tailwind color classes.");
console.log("   - Use the cn utility for class merging.");

console.log("\n6. Test thoroughly:");
console.log(
  "   - Test all functionality to ensure the migration was successful."
);
console.log("   - Check for any styling or layout issues.");

console.log("\n=== Migration Complete ===");
