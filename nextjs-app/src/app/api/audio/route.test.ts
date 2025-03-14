import { POST, GET } from "./route";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Mock fs module
jest.mock("fs", () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined),
    readdir: jest.fn().mockResolvedValue(["test1.webm", "test2.webm"]),
    stat: jest.fn().mockResolvedValue({ isFile: () => true }),
  },
  existsSync: jest.fn().mockReturnValue(true),
}));

// Mock path module
jest.mock("path", () => ({
  join: jest.fn().mockImplementation((...args) => args.join("/")),
  resolve: jest.fn().mockImplementation((...args) => args.join("/")),
}));

// Mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"),
}));

// Mock NextResponse
jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server");
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

describe("Audio API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should save audio file and return URL", async () => {
      // Create a mock audio file with arrayBuffer method
      const audioFile = {
        name: "test.webm",
        type: "audio/webm",
        arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
      };

      // Create a mock FormData
      const formData = new FormData();
      formData.append("audio", audioFile as unknown as File);

      // Create a mock request with formData method
      const request = {
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      // Call the POST handler
      const response = await POST(request);
      const data = await response.json();

      // Check response
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("url");
      expect(data.url).toContain("test-uuid");

      // Check that the file was saved
      expect(fs.promises.mkdir).toHaveBeenCalledWith(expect.any(String), {
        recursive: true,
      });
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining("test-uuid"),
        expect.any(Uint8Array)
      );
    });

    it("should return 400 if no audio file is provided", async () => {
      // Create a mock request with empty FormData
      const emptyFormData = new FormData();
      const request = {
        formData: jest.fn().mockResolvedValue(emptyFormData),
      } as unknown as NextRequest;

      // Call the POST handler
      const response = await POST(request);
      const data = await response.json();

      // Check response
      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("No audio file provided");
    });
  });

  describe("GET", () => {
    it("should return a list of audio files", async () => {
      // Create a mock request with URL
      const request = {
        url: "http://localhost:3000/api/audio",
      } as NextRequest;

      // Call the GET handler
      const response = await GET(request);
      const data = await response.json();

      // Check response
      expect(response.status).toBe(200);
      expect(data).toHaveProperty("files");
      expect(data.files).toHaveLength(2);
      expect(data.files[0]).toHaveProperty("name");
      expect(data.files[0]).toHaveProperty("url");
    });

    it("should return a specific file if filename is provided", async () => {
      // Create a mock request with URL and filename parameter
      const request = {
        url: "http://localhost:3000/api/audio?filename=test1.webm",
      } as NextRequest;

      // Call the GET handler
      const response = await GET(request);

      // Check response
      expect(response.status).toBe(200);
    });
  });
});
