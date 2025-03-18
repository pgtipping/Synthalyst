// This script verifies that CSS files are correctly generated in the build output
const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(__dirname, "../.next");
const staticDir = path.resolve(outputDir, "static");
const publicDir = path.resolve(__dirname, "../public");
const stylesDir = path.resolve(publicDir, "styles");

console.log("Verifying CSS output in build directory...");

// Check if the output directory exists
if (!fs.existsSync(outputDir)) {
  console.error("❌ Error: .next output directory does not exist!");
  process.exit(1);
}

// Check if the static directory exists
if (!fs.existsSync(staticDir)) {
  console.error("❌ Error: .next/static directory does not exist!");
  process.exit(1);
}

// Function to recursively search for CSS files
function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith(".css")) {
      fileList.push({
        path: filePath,
        size: stat.size,
        relativePath: path.relative(outputDir, filePath),
      });
    }
  });

  return fileList;
}

// Find all CSS files in the build output
const cssFiles = findCssFiles(staticDir);

// Find non-critical.css in the public directory
let nonCriticalCssFound = false;
if (fs.existsSync(stylesDir)) {
  const publicStylesFiles = fs.readdirSync(stylesDir);
  nonCriticalCssFound = publicStylesFiles.includes("non-critical.css");

  if (nonCriticalCssFound) {
    console.log("✅ non-critical.css found in public/styles directory");

    // Copy non-critical.css to the output directory if not already there
    const outputStylesDir = path.resolve(outputDir, "static/styles");
    if (!fs.existsSync(outputStylesDir)) {
      fs.mkdirSync(outputStylesDir, { recursive: true });
    }

    fs.copyFileSync(
      path.resolve(stylesDir, "non-critical.css"),
      path.resolve(outputStylesDir, "non-critical.css")
    );

    console.log("✅ Copied non-critical.css to .next/static/styles directory");
  } else {
    console.error(
      "❌ Error: non-critical.css not found in public/styles directory!"
    );
  }
} else {
  console.error("❌ Error: public/styles directory does not exist!");
}

// Log all CSS files found
if (cssFiles.length > 0) {
  console.log(`✅ Found ${cssFiles.length} CSS files in the build output:`);
  cssFiles.forEach((file) => {
    console.log(`  - ${file.relativePath} (${Math.round(file.size / 1024)}KB)`);
  });
} else {
  console.error("❌ Error: No CSS files found in the build output!");
}

// Check globals.css chunks
const globalsCssFiles = cssFiles.filter((file) =>
  file.relativePath.includes("globals")
);
if (globalsCssFiles.length > 0) {
  console.log("✅ Found globals.css chunks in the build output");
} else {
  console.error("❌ Warning: No globals.css chunks found in the build output!");
}

// Summary
console.log("\nCSS Verification Summary:");
console.log(`- Total CSS files: ${cssFiles.length}`);
console.log(`- non-critical.css found: ${nonCriticalCssFound ? "Yes" : "No"}`);
console.log(
  `- globals.css chunks found: ${globalsCssFiles.length > 0 ? "Yes" : "No"}`
);

// Exit with error if no CSS files found
if (cssFiles.length === 0 || !nonCriticalCssFound) {
  console.error("❌ CSS verification failed!");
  process.exit(1);
} else {
  console.log("✅ CSS verification successful!");
}
