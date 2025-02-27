import fetch from "node-fetch";

async function testProdSignupAPI() {
  console.log("Testing production signup API endpoint...");

  try {
    // Generate test user data
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = "Test User";
    const testPassword = "TestPassword123";

    console.log(`Testing with email: ${testEmail}`);

    // Make the API request with detailed error handling
    let response;
    try {
      response = await fetch(
        "https://synthalyst-web.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "SignupTest/1.0",
          },
          body: JSON.stringify({
            name: testName,
            email: testEmail,
            password: testPassword,
          }),
        }
      );

      console.log(`Response status: ${response.status}`);
      console.log(`Response status text: ${response.statusText}`);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Try to get the response text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Then try to parse it as JSON if possible
      let responseData;
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
          console.log("Parsed response data:", responseData);
        } else {
          console.log("Empty response body");
        }
      } catch (parseError) {
        console.log("Could not parse response as JSON:", parseError.message);
      }

      if (response.ok) {
        console.log("✅ Production signup API test successful");
      } else {
        console.log("❌ Production signup API test failed");
      }
    } catch (fetchError) {
      console.error("❌ Fetch error:", fetchError);
    }
  } catch (error) {
    console.error("❌ Error during production signup API test:", error);

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
testProdSignupAPI()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
