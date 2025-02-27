// Script to apply Prisma migrations to production database
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Applying Prisma migrations to production database...");

// Load environment variables from .env.production.local
function loadEnvFile() {
  const envPath = path.resolve(__dirname, "../.env.production.local");
  console.log(`Loading environment variables from ${envPath}`);

  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.production.local file not found at ${envPath}`);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    // Skip comments and empty lines
    if (!line || line.startsWith("#")) return;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      // Remove quotes if present
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }
      envVars[key] = value;
    }
  });

  return envVars;
}

try {
  // Load environment variables
  const envVars = loadEnvFile();

  // Ensure DATABASE_URL is set
  if (!envVars.DATABASE_URL) {
    throw new Error("DATABASE_URL not found in .env.production.local");
  }

  console.log("Database URL found. Running Prisma migrations...");

  // Run the migration command with the environment variables
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: {
      ...process.env,
      ...envVars,
      NODE_ENV: "production",
    },
  });

  console.log("Migrations applied successfully!");
  console.log("Generating Prisma client...");

  // Generate Prisma client
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      ...envVars,
    },
  });

  console.log("✅ All done! Database is ready for use.");
} catch (error) {
  console.error("❌ Error applying migrations:", error.message);
  process.exit(1);
}
