const fs = require("fs");
const path = require("path");

console.log("Preparing styles for build...");

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

// Create non-critical.css if it doesn't exist
if (!fs.existsSync(nonCriticalCssPath)) {
  console.log("Creating non-critical.css file...");

  // Start with a header comment
  let nonCriticalCssContent =
    "/* Non-critical CSS - loaded asynchronously */\n\n";

  // If critical.css exists, include its content as a base
  if (fs.existsSync(criticalCssPath)) {
    console.log("Including critical.css content as a base...");
    const criticalCssContent = fs.readFileSync(criticalCssPath, "utf8");
    nonCriticalCssContent += criticalCssContent + "\n\n";
  }

  // Add essential styling for common components
  nonCriticalCssContent += `
/* Essential Card styling */
.card {
  background-color: hsl(var(--card));
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow: hidden;
}

/* Button styling */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Primary button */
.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Secondary button */
.button-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

/* Tailwind utility classes for flex, spacing, etc. */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.p-4 { padding: 1rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.w-full { width: 100%; }
.rounded-md { border-radius: 0.375rem; }
.bg-white { background-color: white; }
.text-black { color: black; }
.border { border-width: 1px; }
.border-gray-200 { border-color: #e5e7eb; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
`;

  fs.writeFileSync(nonCriticalCssPath, nonCriticalCssContent);
  console.log("Created non-critical.css file");
} else {
  console.log("non-critical.css already exists, making a backup...");
  fs.copyFileSync(nonCriticalCssPath, `${nonCriticalCssPath}.backup`);
}

// Verify postcss configuration
const postcssConfigPath = path.resolve(__dirname, "../postcss.config.cjs");
if (fs.existsSync(postcssConfigPath)) {
  console.log("Checking PostCSS configuration...");
  const postcssConfig = fs.readFileSync(postcssConfigPath, "utf8");

  // Check if it's using @tailwindcss/postcss
  if (!postcssConfig.includes("@tailwindcss/postcss")) {
    console.warn(
      "Warning: postcss.config.cjs is not using @tailwindcss/postcss!"
    );
    console.log("It's recommended to update your PostCSS configuration.");
  } else {
    console.log("PostCSS configuration looks good!");
  }
}

// Check if Tailwind directives are in globals.css
if (fs.existsSync(globalsCssPath)) {
  console.log("Checking Tailwind directives in globals.css...");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");

  if (!globalsCss.includes("@tailwind")) {
    console.warn("Warning: globals.css does not contain Tailwind directives!");
  } else {
    console.log("globals.css contains Tailwind directives!");
  }
}

console.log("Styles preparation complete!");
