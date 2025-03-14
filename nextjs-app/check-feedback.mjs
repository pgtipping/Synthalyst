import fs from "fs";
import path from "path";

const feedbackFilePath = path.join(process.cwd(), "feedback-data.json");

console.log("Checking feedback data file...");
console.log(`File path: ${feedbackFilePath}`);

// Check if file exists
try {
  const exists = fs.existsSync(feedbackFilePath);
  console.log(`File exists: ${exists}`);

  if (exists) {
    // Check file permissions
    const stats = fs.statSync(feedbackFilePath);
    console.log(`File permissions: ${stats.mode.toString(8)}`);

    // Try to read the file
    try {
      const data = fs.readFileSync(feedbackFilePath, "utf8");
      console.log(`File content: ${data}`);

      // Try to parse the content
      try {
        const parsedData = JSON.parse(data);
        console.log(`Parsed data: ${JSON.stringify(parsedData)}`);
      } catch (parseError) {
        console.error(`Error parsing file content: ${parseError.message}`);
      }
    } catch (readError) {
      console.error(`Error reading file: ${readError.message}`);
    }

    // Try to write to the file
    try {
      const testData = [
        {
          id: "test",
          appName: "TestApp",
          rating: 5,
          feedback: "Test feedback",
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(feedbackFilePath, JSON.stringify(testData, null, 2));
      console.log("Successfully wrote test data to file");

      // Read the file again to verify
      const newData = fs.readFileSync(feedbackFilePath, "utf8");
      console.log(`New file content: ${newData}`);
    } catch (writeError) {
      console.error(`Error writing to file: ${writeError.message}`);
    }
  } else {
    // Try to create the file
    try {
      fs.writeFileSync(feedbackFilePath, "[]");
      console.log("Created new feedback data file");
    } catch (createError) {
      console.error(`Error creating file: ${createError.message}`);
    }
  }
} catch (error) {
  console.error(`Error checking file: ${error.message}`);
}
