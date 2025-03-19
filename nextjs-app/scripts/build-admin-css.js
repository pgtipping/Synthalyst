// Script to extract and compile admin-specific CSS
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// Paths
const ADMIN_CSS_PATH = path.join(
  process.cwd(),
  "src/app/(admin)/styles/admin.css"
);
const ADMIN_CORE_CSS_PATH = path.join(
  process.cwd(),
  "src/app/(admin)/styles/admin-core.css"
);
const OUTPUT_DIR = path.join(process.cwd(), "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "admin-styles.css");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read CSS files
const adminCss = fs.readFileSync(ADMIN_CSS_PATH, "utf8");
const adminCoreCss = fs.readFileSync(ADMIN_CORE_CSS_PATH, "utf8");

// Combine CSS
const combinedCss = `/* Admin styles - compiled ${new Date().toISOString()} */\n\n${adminCoreCss}\n\n${adminCss}`;

// Process with PostCSS
postcss([tailwindcss, autoprefixer, cssnano({ preset: "default" })])
  .process(combinedCss, { from: undefined })
  .then((result) => {
    fs.writeFileSync(OUTPUT_FILE, result.css);
    console.log(`Admin CSS compiled to ${OUTPUT_FILE}`);
  })
  .catch((error) => {
    console.error("Error processing admin CSS:", error);
    process.exit(1);
  });
