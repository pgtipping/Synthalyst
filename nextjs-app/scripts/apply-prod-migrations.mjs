// Script to apply Prisma migrations to production database
import { execSync } from "child_process";

console.log("Applying Prisma migrations to production database...");

try {
  // Ensure we're using the production database URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Running Prisma migrations...");

  // Run the migration command
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });

  console.log("Migrations applied successfully!");
  console.log("Generating Prisma client...");

  // Generate Prisma client
  execSync("npx prisma generate", {
    stdio: "inherit",
  });

  console.log("✅ All done! Database is ready for use.");
} catch (error) {
  console.error("❌ Error applying migrations:", error.message);
  process.exit(1);
}
