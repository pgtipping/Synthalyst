// This script runs the TypeScript file to assign admin role
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

try {
  console.log("Assigning admin role to pgtipping1@gmail.com...");

  // Get the current file's directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Get the path to the TypeScript file
  const scriptPath = path.join(__dirname, "assign-admin-role.ts");

  // Run the TypeScript file using ts-node
  execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" });

  console.log("Admin role assignment completed.");
} catch (error) {
  console.error("Error running script:", error);
  process.exit(1);
}
