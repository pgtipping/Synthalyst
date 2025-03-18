const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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
      let updatedConfig = postcssConfig.replace(
        /tailwindcss\s*:\s*\{\}/g,
        '"@tailwindcss/postcss": {}'
      );

      // Also replace "tailwindcss" string literals
      updatedConfig = updatedConfig.replace(
        /"tailwindcss"\s*:\s*\{\}/g,
        '"@tailwindcss/postcss": {}'
      );

      // Also replace 'tailwindcss' string literals
      updatedConfig = updatedConfig.replace(
        /'tailwindcss'\s*:\s*\{\}/g,
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

// Verify and install required dependencies
const requiredPackages = [
  "@tailwindcss/postcss",
  "autoprefixer",
  "clsx",
  "tailwind-merge",
];

for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} package is installed`);
  } catch (error) {
    console.log(`⚠️ ${pkg} package is not installed. Installing now...`);
    try {
      execSync(`npm install --save ${pkg}`, { stdio: "inherit" });
      console.log(`✅ ${pkg} installed successfully!`);
    } catch (installError) {
      console.error(`❌ Failed to install ${pkg}:`, installError.message);
      process.exit(1);
    }
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
      "⚠️ globals.css not found. Creating one with Tailwind directives..."
    );

    const appDir = path.dirname(globalsCssPath);
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }

    const basicGlobalsCss = `/**
 * This is a global stylesheet for the entire application.
 * It defines common styles that will be applied to all pages.
 * Tailwind directives are processed by @tailwindcss/postcss plugin
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
`;

    fs.writeFileSync(globalsCssPath, basicGlobalsCss);
    console.log("✅ Created globals.css with Tailwind directives!");
  }
} catch (error) {
  console.error("❌ Error checking globals.css:", error.message);
  // Don't exit here, continue with the script
}

console.log("✅ PostCSS configuration verified!");
