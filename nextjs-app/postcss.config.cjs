/* eslint-disable */
/** @type {import('postcss-load-config').Config} */
const fs = require("fs");
const path = require("path");

// Read safelist if it exists
let safelist = [];
const safelistPath = path.join(__dirname, "tailwind.safelist.txt");
if (fs.existsSync(safelistPath)) {
  const safelistContent = fs.readFileSync(safelistPath, "utf-8");
  safelist = safelistContent
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("/*"))
    .map((line) => line.trim());

  console.log(
    `Loaded ${safelist.length} safelist items from tailwind.safelist.txt`
  );
}

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Add diagnostic information for debugging
      debug: process.env.NODE_ENV === "development",
      content: ["./src/**/*.{js,ts,jsx,tsx}"],
      safelist,
    },
    autoprefixer: {
      // Add browser information for debugging
      flexbox: true,
      grid: true,
    },
  },
};

// Add additional information for debugging
console.log("PostCSS config loaded from nextjs-app/postcss.config.cjs");
console.log("Using @tailwindcss/postcss for Tailwind CSS v4 processing");

module.exports = config;
