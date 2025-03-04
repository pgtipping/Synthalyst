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
const srcDir = path.join(rootDir, "nextjs-app/src");
const componentsDir = path.join(srcDir, "components/ui");

// Get component and variant names from command line arguments
const componentName = process.argv[2];
const variantName = process.argv[3];

// If no component or variant name is provided, show usage
if (!componentName || !variantName) {
  console.log(
    "Usage: node scripts/create-variant.js [component-name] [variant-name]"
  );
  console.log("\nExample:");
  console.log("  node scripts/create-variant.js card gradient");
  process.exit(0);
}

console.log(`=== Creating ${variantName} variant for ${componentName} ===\n`);

// Check if the component exists
const componentFile = path.join(componentsDir, `${componentName}.tsx`);
if (!fs.existsSync(componentFile)) {
  console.log(`❌ Component ${componentName} not found.`);
  console.log(`Run the following command to install it:`);
  console.log(`  npx shadcn@latest add ${componentName}`);
  process.exit(1);
}

// Read the component file
let componentCode = fs.readFileSync(componentFile, "utf8");

// Check if the component uses cva for variants
const usesCva = componentCode.includes("cva(");

// Define variant templates
const variantTemplates = {
  gradient: {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    accent: "bg-gradient-to-r from-amber-500 to-amber-300 text-white",
    info: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900",
  },
  outline: {
    primary: "border border-primary text-primary hover:bg-primary/10",
    secondary: "border border-secondary text-secondary hover:bg-secondary/10",
    accent: "border border-accent text-accent hover:bg-accent/10",
    destructive:
      "border border-destructive text-destructive hover:bg-destructive/10",
  },
  glass: {
    default:
      "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border border-white/20 dark:border-gray-800/20",
  },
};

// Check if the variant template exists
if (!variantTemplates[variantName]) {
  console.log(`❌ Variant template ${variantName} not found.`);
  console.log("Available variant templates:");
  Object.keys(variantTemplates).forEach((template) => {
    console.log(`  - ${template}`);
  });
  process.exit(1);
}

if (usesCva) {
  // Process components that use cva
  // Find the cva definition
  const cvaRegex =
    /const\s+(\w+)\s*=\s*cva\(\s*['"](.*?)['"],\s*{([^}]*)}\s*\)/s;
  const cvaMatch = componentCode.match(cvaRegex);

  if (!cvaMatch) {
    console.log(`❌ Could not find cva definition in ${componentName}.tsx.`);
    process.exit(1);
  }

  const cvaVarName = cvaMatch[1];
  const cvaBaseClass = cvaMatch[2];
  const cvaOptions = cvaMatch[3];

  // Find the variants object
  const variantsRegex = /variants\s*:\s*{([^}]*)}/s;
  const variantsMatch = cvaOptions.match(variantsRegex);

  if (!variantsMatch) {
    console.log(`❌ Could not find variants object in ${componentName}.tsx.`);
    process.exit(1);
  }

  const variantsObject = variantsMatch[1];

  // Check if the variant already exists
  const variantRegex = new RegExp(`${variantName}\\s*:\\s*{([^}]*)}`);
  const variantMatch = variantsObject.match(variantRegex);

  if (variantMatch) {
    console.log(
      `⚠️ Variant ${variantName} already exists in ${componentName}.tsx.`
    );
    console.log("Updating existing variant...");

    // Update the existing variant
    const existingVariant = variantMatch[1];
    const updatedVariant = Object.entries(variantTemplates[variantName])
      .map(([key, value]) => `      ${key}: "${value}"`)
      .join(",\n");

    const updatedVariantsObject = variantsObject.replace(
      variantRegex,
      `${variantName}: {\n${updatedVariant}\n    }`
    );

    componentCode = componentCode.replace(
      variantsRegex,
      `variants: {${updatedVariantsObject}}`
    );
  } else {
    // Add the new variant
    const newVariant = Object.entries(variantTemplates[variantName])
      .map(([key, value]) => `      ${key}: "${value}"`)
      .join(",\n");

    const updatedVariantsObject =
      variantsObject + `,\n    ${variantName}: {\n${newVariant}\n    }`;

    componentCode = componentCode.replace(
      variantsRegex,
      `variants: {${updatedVariantsObject}}`
    );
  }

  // Update the component interface to include the new variant
  updateComponentInterface();
} else {
  // Process components that don't use cva
  console.log(`Component ${componentName} doesn't use cva for variants.`);
  console.log("Creating a variant utility function...");

  // Create a variant utility function
  const variantUtilityFunction = `
// Variant utility function for ${componentName}
const get${
    componentName.charAt(0).toUpperCase() + componentName.slice(1)
  }VariantStyles = (variant?: string, variantKey?: string) => {
  const variants = {
    ${variantName}: {
${Object.entries(variantTemplates[variantName])
  .map(([key, value]) => `      ${key}: "${value}"`)
  .join(",\n")}
    }
  };

  if (variant && variants[variant]) {
    return variantKey && variants[variant][variantKey] 
      ? variants[variant][variantKey] 
      : variants[variant].default || "";
  }

  return "";
};
`;

  // Find the import statements to insert after
  const importRegex = /import.*from.*;\n(?!import)/s;
  const importMatch = componentCode.match(importRegex);

  if (importMatch) {
    // Add the cn utility import if it doesn't exist
    if (!componentCode.includes("import { cn }")) {
      componentCode = componentCode.replace(
        importRegex,
        `${importMatch[0]}import { cn } from "@/lib/utils";\n\n`
      );
    }

    // Add the variant utility function after imports
    const updatedCode = componentCode.replace(
      importRegex,
      `${importMatch[0]}${variantUtilityFunction}\n`
    );
    componentCode = updatedCode;
  } else {
    console.log(`❌ Could not find import statements in ${componentName}.tsx.`);
    process.exit(1);
  }

  // Update the component to use the variant utility function
  // Find the component function
  const componentFunctionRegex = new RegExp(
    `function\\s+${
      componentName.charAt(0).toUpperCase() + componentName.slice(1)
    }\\s*\\(([^)]*)\\)\\s*{([^}]*)}`
  );
  const componentFunctionMatch = componentCode.match(componentFunctionRegex);

  if (componentFunctionMatch) {
    const componentProps = componentFunctionMatch[1];
    const componentBody = componentFunctionMatch[2];

    // Check if the component already has a variant prop
    if (!componentProps.includes("variant")) {
      // Add the variant prop
      const updatedProps = componentProps.replace(
        /({[^}]*})/,
        `{ variant, ${
          componentProps.includes("{")
            ? componentProps.match(/{([^}]*)}/)[1]
            : ""
        }}`
      );

      // Update the className to use the variant utility function
      const classNameRegex = /className\s*=\s*{[^}]*}/;
      const classNameMatch = componentBody.match(classNameRegex);

      if (classNameMatch) {
        const className = classNameMatch[0];
        const updatedClassName = className.replace(
          /className\s*=\s*{([^}]*)}/,
          `className={cn(get${
            componentName.charAt(0).toUpperCase() + componentName.slice(1)
          }VariantStyles(variant), $1)}`
        );

        const updatedComponentBody = componentBody.replace(
          classNameRegex,
          updatedClassName
        );

        const updatedComponentFunction = `function ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        }(${updatedProps}) {${updatedComponentBody}}`;

        componentCode = componentCode.replace(
          componentFunctionRegex,
          updatedComponentFunction
        );
      } else {
        console.log(`❌ Could not find className in ${componentName}.tsx.`);
      }
    }
  } else {
    console.log(
      `❌ Could not find component function in ${componentName}.tsx.`
    );
  }

  // Update the component interface to include the new variant
  updateComponentInterface();
}

// Function to update the component interface
function updateComponentInterface() {
  const interfaceRegex =
    /interface\s+(\w+)Props\s+extends\s+React\.HTMLAttributes<(\w+)>\s*{([^}]*)}/s;
  const interfaceMatch = componentCode.match(interfaceRegex);

  if (interfaceMatch) {
    const interfaceName = interfaceMatch[1];
    const htmlElement = interfaceMatch[2];
    const interfaceProps = interfaceMatch[3];

    // Check if the variant prop already exists
    const variantPropRegex = /variant\s*\?:\s*[^;]+;/;
    const variantPropMatch = interfaceProps.match(variantPropRegex);

    if (variantPropMatch) {
      // Update the variant prop to include the new variant
      const variantProp = variantPropMatch[0];
      const variantTypeRegex = /:\s*([^;]+);/;
      const variantTypeMatch = variantProp.match(variantTypeRegex);

      if (variantTypeMatch) {
        const variantType = variantTypeMatch[1];

        // Check if the variant type already includes the new variant
        if (!variantType.includes(`"${variantName}"`)) {
          // Add the new variant to the variant type
          const updatedVariantType = variantType.replace(
            /$/,
            ` | "${variantName}"`
          );

          const updatedVariantProp = variantProp.replace(
            variantTypeRegex,
            `: ${updatedVariantType};`
          );

          componentCode = componentCode.replace(
            variantPropRegex,
            updatedVariantProp
          );
        }
      }
    } else {
      // Add the variant prop
      const updatedInterfaceProps =
        interfaceProps +
        `\n  variant?: "${variantName}" | string;\n  variantKey?: string;`;

      componentCode = componentCode.replace(
        interfaceRegex,
        `interface ${interfaceName}Props extends React.HTMLAttributes<${htmlElement}> {${updatedInterfaceProps}}`
      );
    }
  } else {
    // If no interface is found, try to find the props type
    const propsTypeRegex = new RegExp(
      `type\\s+${
        componentName.charAt(0).toUpperCase() + componentName.slice(1)
      }Props\\s*=\\s*([^;]*);`
    );
    const propsTypeMatch = componentCode.match(propsTypeRegex);

    if (propsTypeMatch) {
      const propsType = propsTypeMatch[1];

      // Add the variant prop to the props type
      const updatedPropsType = propsType.replace(
        /({[^}]*})/,
        `{ variant?: "${variantName}" | string; variantKey?: string; $1}`
      );

      componentCode = componentCode.replace(
        propsTypeRegex,
        `type ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        }Props = ${updatedPropsType};`
      );
    } else {
      console.log(
        `❌ Could not find interface or props type in ${componentName}.tsx.`
      );
    }
  }
}

// Write the updated component file
fs.writeFileSync(componentFile, componentCode);

console.log(`✅ Added ${variantName} variant to ${componentName}.tsx.`);
console.log("\nVariant options:");
Object.entries(variantTemplates[variantName]).forEach(([key, value]) => {
  console.log(`  - ${key}: ${value}`);
});

console.log("\nUsage example:");
console.log(
  `<${
    componentName.charAt(0).toUpperCase() + componentName.slice(1)
  } variant="${variantName}" ${
    variantName === "gradient" ? 'variantKey="primary"' : ""
  }>`
);
console.log(`  Content`);
console.log(
  `</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}>`
);

console.log("\n=== Variant Creation Complete ===");
