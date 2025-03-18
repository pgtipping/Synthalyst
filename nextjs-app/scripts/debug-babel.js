const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== Debugging Babel Configuration ===");

// Check if babel plugin is installed
try {
  require.resolve("@babel/plugin-syntax-import-attributes");
  console.log("✅ @babel/plugin-syntax-import-attributes is installed");
} catch (error) {
  console.log("❌ @babel/plugin-syntax-import-attributes is NOT installed");
  console.log("Installing now...");
  try {
    execSync(
      "npm install --save-dev @babel/plugin-syntax-import-attributes@7.26.0",
      { stdio: "inherit" }
    );
    console.log(
      "✅ @babel/plugin-syntax-import-attributes installed successfully"
    );
  } catch (installError) {
    console.error(
      "❌ Failed to install @babel/plugin-syntax-import-attributes:",
      installError.message
    );
  }
}

// Check .babelrc file
const babelrcPath = path.resolve(__dirname, "..", ".babelrc");
if (fs.existsSync(babelrcPath)) {
  console.log("✅ .babelrc exists");
  const babelrc = fs.readFileSync(babelrcPath, "utf8");
  console.log("Contents of .babelrc:");
  console.log(babelrc);

  // Check if the plugin is included
  if (babelrc.includes("@babel/plugin-syntax-import-attributes")) {
    console.log(
      "✅ @babel/plugin-syntax-import-attributes is included in .babelrc"
    );
  } else {
    console.log(
      "❌ @babel/plugin-syntax-import-attributes is NOT included in .babelrc"
    );
    console.log("Updating .babelrc...");
    try {
      const babelrcJson = JSON.parse(babelrc);
      if (!babelrcJson.plugins) {
        babelrcJson.plugins = [];
      }
      if (
        !babelrcJson.plugins.includes("@babel/plugin-syntax-import-attributes")
      ) {
        babelrcJson.plugins.push("@babel/plugin-syntax-import-attributes");
      }
      fs.writeFileSync(babelrcPath, JSON.stringify(babelrcJson, null, 2));
      console.log("✅ .babelrc updated successfully");
    } catch (updateError) {
      console.error("❌ Failed to update .babelrc:", updateError.message);
    }
  }
} else {
  console.log("❌ .babelrc does not exist");
  console.log("Creating .babelrc...");
  try {
    const babelrcContent = JSON.stringify(
      {
        presets: [["next/babel"]],
        plugins: ["@babel/plugin-syntax-import-attributes"],
      },
      null,
      2
    );
    fs.writeFileSync(babelrcPath, babelrcContent);
    console.log("✅ .babelrc created successfully");
  } catch (createError) {
    console.error("❌ Failed to create .babelrc:", createError.message);
  }
}

// Check babel.config.js file
const babelConfigPath = path.resolve(__dirname, "..", "babel.config.js");
if (fs.existsSync(babelConfigPath)) {
  console.log("✅ babel.config.js exists");
  const babelConfig = fs.readFileSync(babelConfigPath, "utf8");
  console.log("Contents of babel.config.js:");
  console.log(babelConfig);

  // Check if the plugin is included
  if (babelConfig.includes("@babel/plugin-syntax-import-attributes")) {
    console.log(
      "✅ @babel/plugin-syntax-import-attributes is included in babel.config.js"
    );
  } else {
    console.log(
      "❌ @babel/plugin-syntax-import-attributes is NOT included in babel.config.js"
    );
  }
} else {
  console.log("❌ babel.config.js does not exist");
}

console.log("=== Babel Configuration Debugging Complete ===");
