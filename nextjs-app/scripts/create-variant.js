#!/usr/bin/env node

/**
 * Create Component Variant Script
 *
 * This script helps create variants for shadcn/ui components.
 * It modifies the component's variants to add new styling options.
 *
 * Usage:
 * node scripts/create-variant.js [component-name] [variant-name]
 */

const fs = require("fs");
const path = require("path");

// Configuration
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const componentsDir = path.join(srcDir, "components/ui");

// Get command line arguments
const args = process.argv.slice(2);
const componentName = args[0];
const variantName = args[1];

// Validate inputs
if (!componentName || !variantName) {
  console.error(
    "Please provide both component name and variant name.\nUsage: node scripts/create-variant.js [component-name] [variant-name]"
  );
  process.exit(1);
}

// Component file path
const componentFile = path.join(componentsDir, `${componentName}.tsx`);

// Check if component exists
if (!fs.existsSync(componentFile)) {
  console.error(`Component '${componentName}' not found at ${componentFile}`);
  process.exit(1);
}

// Read component file
let componentCode = fs.readFileSync(componentFile, "utf8");

// Check if variant already exists
const variantRegex = new RegExp(`${variantName}:`, "i");
if (variantRegex.test(componentCode)) {
  console.error(`Variant '${variantName}' already exists for ${componentName}`);
  process.exit(1);
}

// Find the variants object in the code
const variantsRegex = /variants:\s*{([^}]*)}/s;
const variantsMatch = componentCode.match(variantsRegex);

if (!variantsMatch) {
  console.error(`Could not find variants object in ${componentName}`);
  process.exit(1);
}

// Get the variants content
const variantsContent = variantsMatch[1];

// Find all existing variant names
const existingVariants = variantsContent
  .split(",")
  .map((line) => line.trim())
  .filter((line) => line.includes(":"))
  .map((line) => line.split(":")[0].trim());

console.log("Existing variants:", existingVariants);

// Add the new variant
const updatedVariantsContent =
  variantsContent.trim() +
  `,
    ${variantName}: {
      // Add your variant styles here
    }`;

// Replace the variants content in the code
const updatedComponentCode = componentCode.replace(
  variantsRegex,
  `variants: {${updatedVariantsContent}}`
);

// Write the updated code back to the file
fs.writeFileSync(componentFile, updatedComponentCode);

// Update the component interface
updateComponentInterface();

console.log(`✅ Added '${variantName}' variant to ${componentName}`);
console.log(`🔍 Now edit the variant in ${componentFile}`);

/**
 * Updates the component interface to include the new variant
 */
function updateComponentInterface() {
  // Find the component interface
  const interfaceRegex = new RegExp(
    `interface\\s+${capitalizeFirstLetter(
      componentName
    )}Props\\s+extends\\s+[^{]*{([^}]*)}`,
    "s"
  );
  const interfaceMatch = componentCode.match(interfaceRegex);

  if (!interfaceMatch) {
    console.warn(
      `Could not find interface for ${componentName}. You may need to update it manually.`
    );
    return;
  }

  // Get the interface content
  const interfaceContent = interfaceMatch[1];

  // Check if variant is already in the interface
  const variantPropRegex = /variant\?:\s*[^;]*/;
  const variantPropMatch = interfaceContent.match(variantPropRegex);

  if (!variantPropMatch) {
    console.warn(
      `Could not find variant prop in interface. You may need to update it manually.`
    );
    return;
  }

  // Get the variant prop
  const variantProp = variantPropMatch[0];

  // Extract the variant types
  const variantTypesRegex = /variant\?:\s*"([^"]*)"/;
  const variantTypesMatch = variantProp.match(variantTypesRegex);

  if (!variantTypesMatch) {
    console.warn(
      `Could not parse variant types. You may need to update the interface manually.`
    );
    return;
  }

  // Get the variant types
  const variantTypes = variantTypesMatch[1];

  // Add the new variant to the types
  const updatedVariantTypes = variantTypes + `" | "${variantName}`;

  // Replace the variant types in the prop
  const updatedVariantProp = variantProp.replace(
    variantTypesRegex,
    `variant?: "${updatedVariantTypes}"`
  );

  // Replace the variant prop in the interface
  const updatedInterfaceContent = interfaceContent.replace(
    variantPropRegex,
    updatedVariantProp
  );

  // Replace the interface content in the code
  const updatedCode = componentCode.replace(
    interfaceRegex,
    `interface ${capitalizeFirstLetter(
      componentName
    )}Props extends ${getExtendsType()} {${updatedInterfaceContent}}`
  );

  // Write the updated code back to the file
  fs.writeFileSync(componentFile, updatedCode);
}

/**
 * Gets the type that the component interface extends
 */
function getExtendsType() {
  const extendsRegex = new RegExp(
    `interface\\s+${capitalizeFirstLetter(
      componentName
    )}Props\\s+extends\\s+([^{]*)`,
    "s"
  );
  const extendsMatch = componentCode.match(extendsRegex);

  if (!extendsMatch) {
    return "React.HTMLAttributes<HTMLElement>";
  }

  return extendsMatch[1].trim();
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
