import { NextResponse } from "next/server";
import { createNewTemplate, createNewVersion } from "@/lib/templates";
import { prisma } from "@/lib/prisma";

interface TestResult {
  success: boolean;
  result?: unknown;
  error?: string;
}

async function runTest(
  testName: string,
  testFn: () => Promise<unknown>
): Promise<TestResult> {
  try {
    console.log(`\n=== Running Test: ${testName} ===`);
    const result = await testFn();
    console.log(`✅ Test Passed: ${testName}`);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ Test Failed: ${testName}`);
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  try {
    // For testing purposes, get or create a test user
    let testUser = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
        },
      });
    }

    const baseTemplate = {
      title: "Test Software Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      description: "Test description",
      responsibilities: ["Write code", "Test features"],
      requirements: {
        required: [
          {
            name: "JavaScript",
            level: "advanced" as const,
            description: "Strong JavaScript skills",
          },
        ],
        preferred: ["TypeScript"],
      },
      qualifications: {
        education: ["Bachelor's degree"],
        experience: ["3+ years"],
        certifications: [],
      },
      metadata: {
        industry: "Technology",
        level: "Senior",
        isTemplate: true,
      },
    };

    const testResults = {
      // Test Case 1: Basic Template Creation and Versioning
      basicFlow: await runTest("Basic Template Flow", async () => {
        const createResult = await createNewTemplate(baseTemplate, testUser.id);
        const duplicateResult = await createNewTemplate(
          baseTemplate,
          testUser.id
        );

        const modifiedTemplate = {
          ...baseTemplate,
          description: "Updated test description",
          responsibilities: [...baseTemplate.responsibilities, "Review code"],
        };

        const versionResult =
          createResult.type === "new"
            ? await createNewVersion(
                modifiedTemplate,
                createResult.template.id,
                testUser.id
              )
            : null;

        return { createResult, duplicateResult, versionResult };
      }),

      // Test Case 2: Empty Fields Handling
      emptyFields: await runTest("Empty Fields Handling", async () => {
        const emptyTemplate = {
          ...baseTemplate,
          description: "",
          responsibilities: [],
          requirements: {
            required: [],
            preferred: [],
          },
        };

        return await createNewTemplate(emptyTemplate, testUser.id);
      }),

      // Test Case 3: Extremely Long Content
      longContent: await runTest("Long Content Handling", async () => {
        const longTemplate = {
          ...baseTemplate,
          description: "A".repeat(10000),
          responsibilities: Array(100).fill("Long responsibility description"),
        };

        return await createNewTemplate(longTemplate, testUser.id);
      }),

      // Test Case 4: Special Characters
      specialChars: await runTest("Special Characters Handling", async () => {
        const specialCharsTemplate = {
          ...baseTemplate,
          title: "Test 特殊文字 🚀 #$%^&*",
          description: "Description with ñ, é, ü, ß, 漢字",
        };

        return await createNewTemplate(specialCharsTemplate, testUser.id);
      }),

      // Test Case 5: Version Chain Testing
      versionChain: await runTest("Version Chain Testing", async () => {
        const createResult = await createNewTemplate(baseTemplate, testUser.id);
        if (createResult.type !== "new") return createResult;

        const versions = [];
        let currentVersion = createResult.template;

        // Create 5 versions with incremental changes
        for (let i = 1; i <= 5; i++) {
          const modifiedTemplate = {
            ...baseTemplate,
            description: `Version ${i} description`,
            responsibilities: [...baseTemplate.responsibilities, `Task ${i}`],
          };

          const versionResult = await createNewVersion(
            modifiedTemplate,
            currentVersion.id,
            testUser.id
          );

          versions.push(versionResult);
          if (versionResult.type === "version") {
            currentVersion = versionResult.template;
          }
        }

        // Verify version chain
        const history = await prisma.jobDescription.findMany({
          where: {
            OR: [
              { id: createResult.template.id },
              { parentId: createResult.template.id },
            ],
          },
          orderBy: {
            version: "desc",
          },
        });

        return { createResult, versions, history };
      }),

      // Test Case 6: Concurrent Version Creation
      concurrentVersions: await runTest(
        "Concurrent Version Creation",
        async () => {
          const createResult = await createNewTemplate(
            baseTemplate,
            testUser.id
          );
          if (createResult.type !== "new") return createResult;

          // Try to create multiple versions concurrently
          const modifiedTemplate1 = {
            ...baseTemplate,
            description: "Concurrent version 1",
          };
          const modifiedTemplate2 = {
            ...baseTemplate,
            description: "Concurrent version 2",
          };

          const results = await Promise.all([
            createNewVersion(
              modifiedTemplate1,
              createResult.template.id,
              testUser.id
            ),
            createNewVersion(
              modifiedTemplate2,
              createResult.template.id,
              testUser.id
            ),
          ]);

          return { createResult, concurrentResults: results };
        }
      ),

      // Test Case 7: Invalid Template ID
      invalidId: await runTest("Invalid Template ID Handling", async () => {
        try {
          await createNewVersion(baseTemplate, "invalid-id", testUser.id);
          return "Should have thrown an error";
        } catch (error) {
          return {
            expectedError:
              error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    };

    return NextResponse.json(testResults);
  } catch (error) {
    console.error("Test suite error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test suite failed" },
      { status: 500 }
    );
  }
}
