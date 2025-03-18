const fs = require("fs");
const path = require("path");

// Check if @tailwindcss/postcss is properly configured
const postcssConfigPath = path.resolve(__dirname, "..", "postcss.config.cjs");
let postcssConfig;

try {
  // Check if config file exists
  if (!fs.existsSync(postcssConfigPath)) {
    console.log("⚠️ PostCSS configuration file not found. Creating one...");
    const newConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

module.exports = config;
`;
    fs.writeFileSync(postcssConfigPath, newConfig);
    console.log("✅ PostCSS configuration created successfully!");
    postcssConfig = newConfig;
  } else {
    // Read the config file
    postcssConfig = fs.readFileSync(postcssConfigPath, "utf8");

    // Check if it includes @tailwindcss/postcss
    if (!postcssConfig.includes("@tailwindcss/postcss")) {
      console.log(
        "🔄 Updating PostCSS configuration to use @tailwindcss/postcss..."
      );

      // Replace tailwindcss with @tailwindcss/postcss
      const updatedConfig = postcssConfig.replace(
        /tailwindcss\s*:\s*\{\}/g,
        '"@tailwindcss/postcss": {}'
      );

      // Write the updated configuration
      fs.writeFileSync(postcssConfigPath, updatedConfig);
      console.log("✅ PostCSS configuration updated successfully!");
    } else {
      console.log(
        "✅ PostCSS configuration is already using @tailwindcss/postcss"
      );
    }
  }
} catch (error) {
  console.error("❌ Error updating PostCSS configuration:", error.message);
  process.exit(1);
}

// Verify the installation of @tailwindcss/postcss
try {
  require.resolve("@tailwindcss/postcss");
  console.log("✅ @tailwindcss/postcss package is installed");
} catch (error) {
  console.log(
    "⚠️ @tailwindcss/postcss package is not installed. Installing now..."
  );
  const { execSync } = require("child_process");
  try {
    execSync("npm install --save @tailwindcss/postcss", { stdio: "inherit" });
    console.log("✅ @tailwindcss/postcss installed successfully!");
  } catch (installError) {
    console.error(
      "❌ Failed to install @tailwindcss/postcss:",
      installError.message
    );
    process.exit(1);
  }
}

// Check the globals.css file to ensure it has proper Tailwind directives
try {
  const globalsCssPath = path.resolve(
    __dirname,
    "..",
    "src",
    "app",
    "globals.css"
  );
  if (fs.existsSync(globalsCssPath)) {
    const globalsCss = fs.readFileSync(globalsCssPath, "utf8");
    if (
      !globalsCss.includes("@tailwind base") ||
      !globalsCss.includes("@tailwind components") ||
      !globalsCss.includes("@tailwind utilities")
    ) {
      console.log(
        "⚠️ globals.css is missing required Tailwind directives. Updating..."
      );

      // Create a properly formatted globals.css with Tailwind directives
      const updatedGlobalsCss = `/**
 * This is a global stylesheet for the entire application.
 * It defines common styles that will be applied to all pages.
 * Tailwind directives are processed by @tailwindcss/postcss plugin
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

${globalsCss.includes("@layer base") ? "" : "@layer base {\n"}${
        globalsCss.includes("@layer base")
          ? globalsCss
          : `${globalsCss}${!globalsCss.endsWith("\n") ? "\n" : ""}`
      }${globalsCss.includes("@layer base") ? "" : "}\n"}`;

      fs.writeFileSync(globalsCssPath, updatedGlobalsCss);
      console.log(
        "✅ globals.css updated successfully with Tailwind directives!"
      );
    } else {
      console.log("✅ globals.css already has required Tailwind directives");
    }
  } else {
    console.log(
      "⚠️ globals.css not found. Tailwind directives need to be checked manually."
    );
  }
} catch (error) {
  console.error("❌ Error checking globals.css:", error.message);
  // Don't exit here, continue with the script
}

console.log("✅ PostCSS configuration verified!");
