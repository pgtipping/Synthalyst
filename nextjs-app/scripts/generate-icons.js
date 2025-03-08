import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the icon sizes we need
const iconSizes = [
  16, 32, 48, 64, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512,
];

// Define the favicon sizes
const faviconSizes = [16, 32, 48];

// Define the Apple touch icon sizes
const appleTouchIconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];

// Define the Android icon sizes
const androidIconSizes = [36, 48, 72, 96, 144, 192, 512];

// Define the Microsoft icon sizes
const msIconSizes = [70, 144, 150, 310];

// Path to the SVG logo
const svgLogoPath = path.join(__dirname, "../public/icons/logo.svg");

// Output directory for the icons
const outputDir = path.join(__dirname, "../public/icons");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate PNG icons from SVG
async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgLogoPath);

    // Generate all icon sizes
    for (const size of iconSizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

      console.log(`Generated icon-${size}x${size}.png`);
    }

    // Generate favicon.ico (we'll just use the 32x32 PNG for now)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, "../favicon.ico"));

    console.log("Generated favicon.ico");

    // Generate Apple touch icons
    for (const size of appleTouchIconSizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `apple-touch-icon-${size}x${size}.png`));

      console.log(`Generated apple-touch-icon-${size}x${size}.png`);
    }

    // Generate Android icons
    for (const size of androidIconSizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `android-icon-${size}x${size}.png`));

      console.log(`Generated android-icon-${size}x${size}.png`);
    }

    // Generate Microsoft icons
    for (const size of msIconSizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `ms-icon-${size}x${size}.png`));

      console.log(`Generated ms-icon-${size}x${size}.png`);
    }

    console.log("All icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
  }
}

// Run the icon generation
generateIcons();
