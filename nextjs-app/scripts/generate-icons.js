import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source logo
const sourceLogo = path.join(__dirname, "../public/icons/logo-high-res.png");

// Ensure the directories exist
const iconDirs = [
  path.join(__dirname, "../public/icons/favicon"),
  path.join(__dirname, "../public/icons/apple-touch-icon"),
  path.join(__dirname, "../public/icons/android-chrome"),
];

iconDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate favicon icons
const faviconSizes = [16, 32, 48, 64];
faviconSizes.forEach((size) => {
  sharp(sourceLogo)
    .resize(size, size)
    .toFile(
      path.join(
        __dirname,
        `../public/icons/favicon/favicon-${size}x${size}.png`
      )
    )
    .then(() => console.log(`Generated favicon-${size}x${size}.png`))
    .catch((err) =>
      console.error(`Error generating favicon-${size}x${size}.png:`, err)
    );
});

// Generate Apple touch icons
const appleTouchIconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
appleTouchIconSizes.forEach((size) => {
  sharp(sourceLogo)
    .resize(size, size)
    .toFile(
      path.join(
        __dirname,
        `../public/icons/apple-touch-icon/apple-touch-icon-${size}x${size}.png`
      )
    )
    .then(() => console.log(`Generated apple-touch-icon-${size}x${size}.png`))
    .catch((err) =>
      console.error(
        `Error generating apple-touch-icon-${size}x${size}.png:`,
        err
      )
    );
});

// Generate Android chrome icons
const androidChromeSizes = [36, 48, 72, 96, 144, 192, 384, 512];
androidChromeSizes.forEach((size) => {
  sharp(sourceLogo)
    .resize(size, size)
    .toFile(
      path.join(
        __dirname,
        `../public/icons/android-chrome/android-chrome-${size}x${size}.png`
      )
    )
    .then(() => console.log(`Generated android-chrome-${size}x${size}.png`))
    .catch((err) =>
      console.error(`Error generating android-chrome-${size}x${size}.png:`, err)
    );
});

// Generate Open Graph and Twitter images
const socialMediaSizes = [
  { width: 1200, height: 630, name: "og-image.png" },
  { width: 1200, height: 600, name: "twitter-image.png" },
];

socialMediaSizes.forEach(({ width, height, name }) => {
  sharp(sourceLogo)
    .resize({
      width,
      height,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toFile(path.join(__dirname, `../public/icons/${name}`))
    .then(() => console.log(`Generated ${name}`))
    .catch((err) => console.error(`Error generating ${name}:`, err));
});

// Generate a favicon.ico file (multi-size ICO file)
sharp(sourceLogo)
  .resize(32, 32)
  .toFile(path.join(__dirname, "../public/favicon.ico"))
  .then(() => console.log("Generated favicon.ico"))
  .catch((err) => console.error("Error generating favicon.ico:", err));

console.log("Icon generation process completed!");
