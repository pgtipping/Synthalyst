import fetch from "node-fetch";

async function testSignupAPI() {
  console.log("Testing signup API endpoint...");

  try {
    // Generate test user data
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = "Test User";
    const testPassword = "TestPassword123";

    console.log(`Testing with email: ${testEmail}`);

    // Make the API request
    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });

    // Get the response data
    const responseData = await response.json();

    // Log the response
    console.log(`Response status: ${response.status}`);
    console.log("Response data:", responseData);

    if (response.ok) {
      console.log("✅ Signup API test successful");
    } else {
      console.log("❌ Signup API test failed");
    }

    // If successful, we should clean up the user
    if (response.ok && responseData.user && responseData.user.id) {
      console.log(
        "Note: You may want to manually delete this test user from the database"
      );
    }
  } catch (error) {
    console.error("❌ Error during signup API test:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

// Run the test
testSignupAPI()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
