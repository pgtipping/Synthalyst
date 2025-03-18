const fs = require("fs");
const path = require("path");

// Check if @tailwindcss/postcss is properly configured
const postcssConfigPath = path.resolve(__dirname, "..", "postcss.config.cjs");
let postcssConfig;

try {
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

console.log("✅ PostCSS configuration verified!");
