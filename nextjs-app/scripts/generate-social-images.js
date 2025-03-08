import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SVG logo
const svgLogoPath = path.join(__dirname, "../public/icons/logo.svg");

// Output directory for the social images
const outputDir = path.join(__dirname, "../public/icons");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate social media images
async function generateSocialImages() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgLogoPath);

    // Resize the logo for compositing
    const resizedLogo = await sharp(svgBuffer).resize(600, 400).toBuffer();

    // Create a background for the OpenGraph image (1200x630)
    const ogWidth = 1200;
    const ogHeight = 630;

    // Generate OpenGraph image (1200x630)
    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(`
          <svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${ogWidth}" height="${ogHeight}" fill="#ffffff"/>
            <rect width="${ogWidth}" height="${ogHeight}" fill="#4285F4" opacity="0.1"/>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4285F4" stop-opacity="0.1"/>
              <stop offset="100%" stop-color="#4285F4" stop-opacity="0.3"/>
            </linearGradient>
            <rect width="${ogWidth}" height="${ogHeight}" fill="url(#grad)"/>
          </svg>
        `),
          top: 0,
          left: 0,
        },
        {
          input: resizedLogo,
          top: 115,
          left: 300,
        },
      ])
      .toFile(path.join(outputDir, "og-image.png"));

    console.log("Generated og-image.png");

    // Create a background for the Twitter image (1200x600)
    const twitterWidth = 1200;
    const twitterHeight = 600;

    // Generate Twitter image (1200x600)
    await sharp({
      create: {
        width: twitterWidth,
        height: twitterHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(`
          <svg width="${twitterWidth}" height="${twitterHeight}" viewBox="0 0 ${twitterWidth} ${twitterHeight}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${twitterWidth}" height="${twitterHeight}" fill="#ffffff"/>
            <rect width="${twitterWidth}" height="${twitterHeight}" fill="#4285F4" opacity="0.1"/>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4285F4" stop-opacity="0.1"/>
              <stop offset="100%" stop-color="#4285F4" stop-opacity="0.3"/>
            </linearGradient>
            <rect width="${twitterWidth}" height="${twitterHeight}" fill="url(#grad)"/>
          </svg>
        `),
          top: 0,
          left: 0,
        },
        {
          input: resizedLogo,
          top: 100,
          left: 300,
        },
      ])
      .toFile(path.join(outputDir, "twitter-image.png"));

    console.log("Generated twitter-image.png");

    console.log("All social images generated successfully!");
  } catch (error) {
    console.error("Error generating social images:", error);
  }
}

// Run the social image generation
generateSocialImages();
