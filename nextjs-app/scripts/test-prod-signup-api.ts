// Test production signup API endpoint
import fetch from "node-fetch";

async function isServerRunning(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      timeout: 5000,
    });
    return response.status !== 404; // Any response except 404 means server is running
  } catch {
    // Ignore error - server not running or connection error
    return false;
  }
}

async function testProductionSignupAPI(): Promise<void> {
  console.log("Testing PRODUCTION signup API endpoint...");

  // Use the production URL
  const baseUrl = "https://synthalyst-web.vercel.app";
  const signupUrl = `${baseUrl}/api/auth/signup`;

  console.log(`Using production API URL: ${signupUrl}`);

  // Check if server is running
  console.log("Checking if production server is running...");
  const serverRunning = await isServerRunning(baseUrl);

  if (!serverRunning) {
    console.error("❌ Production server is not running at", baseUrl);
    return;
  }

  console.log("✅ Production server is running");

  // Generate a unique email for testing
  const testEmail = `test-${Date.now()}@example.com`;

  const testUser = {
    name: "Test User",
    email: testEmail,
    password: "TestPassword123",
  };

  console.log(`Testing with email: ${testEmail}`);

  try {
    console.log("Sending signup request to production...");

    const response = await fetch(signupUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    // Try to parse response as JSON
    let responseData;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // If not JSON, get text
      const text = await response.text();
      responseData = {
        nonJsonResponse:
          text.substring(0, 500) + (text.length > 500 ? "..." : ""),
      };
    }

    console.log(`Response status: ${response.status}`);
    console.log(
      "Response headers:",
      Object.fromEntries([...response.headers.entries()])
    );
    console.log(
      "Response body:",
      typeof responseData === "object"
        ? JSON.stringify(responseData, null, 2)
        : responseData
    );

    if (response.ok) {
      console.log("✅ Production signup API test successful!");
    } else {
      console.error(
        "❌ Production signup API test failed with status:",
        response.status
      );
      console.error("Error details:", responseData);
    }
  } catch (error: unknown) {
    console.error("❌ Production signup API test failed with exception:");
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available"
    );
  }
}

testProductionSignupAPI()
  .then(() => {
    console.log("Production signup API test completed.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      "Unhandled error in test script:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
