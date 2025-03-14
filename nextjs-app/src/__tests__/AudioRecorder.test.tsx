import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { AudioRecorder } from "@/components/interview-prep/AudioRecorder";
import "@testing-library/jest-dom";

// Mock the MediaRecorder API
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: jest.fn(),
  onerror: jest.fn(),
  state: "inactive",
  stream: null,
};

// Mock MediaRecorder constructor and isTypeSupported
interface MockMediaRecorderConstructor extends jest.Mock {
  isTypeSupported: jest.Mock;
}

const MockMediaRecorder = jest
  .fn()
  .mockImplementation(() => mockMediaRecorder) as MockMediaRecorderConstructor;
MockMediaRecorder.isTypeSupported = jest.fn().mockReturnValue(true);
global.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;

// Mock getUserMedia
const mockGetUserMedia = jest.fn();
Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

// Mock window.URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock fetch
const originalFetch = global.fetch;
global.fetch = jest.fn();

describe("AudioRecorder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [
        {
          stop: jest.fn(),
        },
      ],
    });

    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("renders without crashing", () => {
    const { getByText } = render(<AudioRecorder />);
    expect(getByText("Start Recording")).toBeInTheDocument();
  });

  it("requests microphone permission when starting recording", async () => {
    const { getByText } = render(<AudioRecorder />);
    const startButton = getByText("Start Recording");

    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        audio: expect.any(Object),
      })
    );
  });

  it("shows recording status when recording", async () => {
    const { getByText } = render(<AudioRecorder />);

    await act(async () => {
      fireEvent.click(getByText("Start Recording"));
      // Wait for the MediaRecorder to be initialized
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // The button text should change to "Stop Recording"
    expect(getByText("Stop Recording")).toBeInTheDocument();
  });

  it("uploads audio file after stopping recording", async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: "/uploads/test.webm" }),
    });

    const { getByText } = render(
      <AudioRecorder onRecordingComplete={jest.fn()} />
    );

    // Start recording
    await act(async () => {
      fireEvent.click(getByText("Start Recording"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Stop recording
    await act(async () => {
      fireEvent.click(getByText("Stop Recording"));
      // Simulate data available event
      const blob = new Blob(["test"], { type: "audio/webm" });
      mockMediaRecorder.ondataavailable({ data: blob });
    });

    // Wait for fetch to be called
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/audio",
          expect.any(Object)
        );
      },
      { timeout: 3000 }
    );
  });

  it("shows error message when upload fails", async () => {
    // Mock failed fetch response
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Upload failed")
    );

    const { getByText, findByText } = render(
      <AudioRecorder onRecordingComplete={jest.fn()} />
    );

    // Start recording
    await act(async () => {
      fireEvent.click(getByText("Start Recording"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Stop recording
    await act(async () => {
      fireEvent.click(getByText("Stop Recording"));
      // Simulate data available event
      const blob = new Blob(["test"], { type: "audio/webm" });
      mockMediaRecorder.ondataavailable({ data: blob });
    });

    // Wait for error message
    const errorMessage = await findByText(/Failed to upload audio/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
