const fs = require("fs");
const path = require("path");

console.log("Preparing styles for build with performance optimization...");

// Ensure the public/styles directory exists
const stylesDir = path.resolve(__dirname, "../public/styles");
if (!fs.existsSync(stylesDir)) {
  console.log("Creating public/styles directory...");
  fs.mkdirSync(stylesDir, { recursive: true });
}

// Path to non-critical.css
const nonCriticalCssPath = path.join(stylesDir, "non-critical.css");
const criticalCssPath = path.resolve(__dirname, "../src/app/critical.css");
const globalsCssPath = path.resolve(__dirname, "../src/app/globals.css");

// Helper function to check if a CSS rule exists in a file
const cssRuleExistsIn = (rule, fileContent) => {
  // Remove whitespace and comments for comparison
  const normalizedRule = rule
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  const normalizedContent = fileContent
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();

  return normalizedContent.includes(normalizedRule);
};

// Get critical CSS content if exists
let criticalCssContent = "";
if (fs.existsSync(criticalCssPath)) {
  criticalCssContent = fs.readFileSync(criticalCssPath, "utf8");
  console.log("Read critical.css content");
}

// Get global CSS content if exists
let globalsCssContent = "";
if (fs.existsSync(globalsCssPath)) {
  globalsCssContent = fs.readFileSync(globalsCssPath, "utf8");
  console.log("Read globals.css content");

  // Check that globals.css has Tailwind directives
  if (!globalsCssContent.includes("@tailwind")) {
    console.warn(
      "⚠️ Warning: globals.css does not contain Tailwind directives!"
    );
  }
}

// Create non-critical.css if it doesn't exist
if (!fs.existsSync(nonCriticalCssPath)) {
  console.log("Creating optimized non-critical.css file...");

  // Start with a header comment
  let nonCriticalCssContent = `/* 
 * Non-critical CSS - loaded asynchronously
 * This file contains styles that are not needed for the initial render
 * It is loaded after the page becomes interactive
 */

`;

  // Create a structured non-critical CSS with minimal essential styles
  // Ensure these don't duplicate what's in critical.css
  const essentialStyles = `
/* --- Layout Components --- */

/* Card component styles */
.card {
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* --- Form elements --- */

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--input));
  background-color: transparent;
  color: hsl(var(--foreground));
}

.form-input:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.3);
}

/* --- Table styles --- */

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid hsl(var(--border));
}

th {
  font-weight: 600;
  background-color: hsl(var(--muted));
}

/* --- Animations --- */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.4s ease-out;
}
`;

  // Function to add styles only if they don't exist in critical CSS
  const addNonDuplicateStyles = (styles) => {
    // Split styles into individual rules
    const styleRules = styles.split(/}[\s\n]*/).filter((rule) => rule.trim());

    for (const rule of styleRules) {
      const ruleWithClosingBrace = rule + "}";

      // Only add the rule if it doesn't exist in critical CSS
      if (!cssRuleExistsIn(ruleWithClosingBrace, criticalCssContent)) {
        nonCriticalCssContent += ruleWithClosingBrace + "\n\n";
      }
    }
  };

  // Add essential styles that don't duplicate critical CSS
  addNonDuplicateStyles(essentialStyles);

  fs.writeFileSync(nonCriticalCssPath, nonCriticalCssContent);
  console.log("✅ Created optimized non-critical.css file");
} else {
  // If non-critical.css already exists, make a backup and check for potential duplicated styles
  console.log("non-critical.css already exists, making a backup...");
  fs.copyFileSync(nonCriticalCssPath, `${nonCriticalCssPath}.backup`);

  // Read existing non-critical CSS
  const existingNonCriticalCss = fs.readFileSync(nonCriticalCssPath, "utf8");

  // Check for optimization opportunities
  if (existingNonCriticalCss.length > 10000) {
    console.warn(
      "⚠️ Warning: non-critical.css is quite large (" +
        Math.round(existingNonCriticalCss.length / 1024) +
        "KB), consider further optimization"
    );
  }

  // Check for potential duplicated styles
  const cssRules = existingNonCriticalCss
    .split(/}[\s\n]*/)
    .filter((rule) => rule.trim());
  let duplicateCount = 0;

  for (const rule of cssRules) {
    if (rule.trim() && cssRuleExistsIn(rule + "}", criticalCssContent)) {
      duplicateCount++;
    }
  }

  if (duplicateCount > 0) {
    console.warn(
      `⚠️ Warning: Found ${duplicateCount} potentially duplicated styles between critical and non-critical CSS`
    );
  }
}

// Verify postcss configuration
const postcssConfigPath = path.resolve(__dirname, "../postcss.config.cjs");
if (fs.existsSync(postcssConfigPath)) {
  console.log("Checking PostCSS configuration...");
  const postcssConfig = fs.readFileSync(postcssConfigPath, "utf8");

  // Check if it's using @tailwindcss/postcss
  if (!postcssConfig.includes("@tailwindcss/postcss")) {
    console.warn(
      "⚠️ Warning: postcss.config.cjs is not using @tailwindcss/postcss!"
    );
    console.log("It's recommended to update your PostCSS configuration.");
  } else {
    console.log("✅ PostCSS configuration looks good!");
  }
}

// Add a tailwind.safelist.txt file to ensure critical class names aren't purged
const safelistPath = path.resolve(__dirname, "../tailwind.safelist.txt");
if (!fs.existsSync(safelistPath)) {
  console.log(
    "Creating Tailwind safelist to prevent important classes from being purged..."
  );

  // Add critical classes that should never be purged
  const safelist = `
/* Safelist for Tailwind CSS - these classes will never be purged */
.flex
.flex-col
.items-center
.justify-center
.justify-between
.space-x-2
.space-y-2
.p-4
.px-4
.py-2
.mt-4
.mb-4
.w-full
.bg-white
.text-black
.rounded-md
.border
.border-gray-200
.shadow-md
`;

  fs.writeFileSync(safelistPath, safelist.trim());
  console.log("✅ Created Tailwind safelist");
}

console.log("✅ Styles preparation complete!");
console.log("🚀 Performance optimizations applied to CSS loading process");
