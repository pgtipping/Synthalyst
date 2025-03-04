import React from "react";
import { render, screen } from "@testing-library/react";
import { ClientComponentWrapper, LoadingUI } from "../ClientComponentWrapper";
import { useSearchParams } from "next/navigation";

// Mock the useSearchParams hook
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/test",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Create a test component that uses navigation hooks
function TestComponent({ text = "Test Content" }: { text?: string }) {
  // This will trigger the Suspense boundary
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  return <div data-testid="test-component">{text}</div>;
}

describe("ClientComponentWrapper", () => {
  it("should render the loading UI while component is suspended", () => {
    render(
      <ClientComponentWrapper loadingText="Test Loading">
        <TestComponent />
      </ClientComponentWrapper>
    );

    // The loading UI should be visible
    expect(screen.getByText("Test Loading")).toBeInTheDocument();

    // The wrapped component should not be visible yet
    expect(screen.queryByTestId("test-component")).not.toBeInTheDocument();
  });

  it("should render the wrapped component after suspense resolves", async () => {
    // Mock React.Suspense to immediately render children instead of fallback
    jest
      .spyOn(React, "Suspense")
      .mockImplementation(({ children }) => <>{children}</>);

    render(
      <ClientComponentWrapper loadingText="Test Loading">
        <TestComponent text="Resolved Content" />
      </ClientComponentWrapper>
    );

    // The wrapped component should be visible
    expect(screen.getByText("Resolved Content")).toBeInTheDocument();

    // The loading UI should not be visible
    expect(screen.queryByText("Test Loading")).not.toBeInTheDocument();
  });
});

describe("LoadingUI", () => {
  it("should render default variant correctly", () => {
    render(<LoadingUI variant="default" loadingText="Default Loading" />);

    expect(screen.getByText("Default Loading")).toBeInTheDocument();
    // Check for the default container class
    const container = screen.getByText("Default Loading").parentElement;
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );
  });

  it("should render minimal variant correctly", () => {
    render(<LoadingUI variant="minimal" loadingText="Minimal Loading" />);

    expect(screen.getByText("Minimal Loading")).toBeInTheDocument();
    // Check for the minimal container class
    const container = screen.getByText("Minimal Loading").parentElement;
    expect(container).toHaveClass("flex", "items-center", "justify-center");
  });

  it("should render fullscreen variant correctly", () => {
    render(<LoadingUI variant="fullscreen" loadingText="Fullscreen Loading" />);

    expect(screen.getByText("Fullscreen Loading")).toBeInTheDocument();
    // Check for the fullscreen container class
    const container = screen.getByText("Fullscreen Loading").parentElement;
    expect(container).toHaveClass(
      "fixed",
      "inset-0",
      "bg-background/80",
      "backdrop-blur-sm"
    );
  });

  it("should render skeleton variant correctly", () => {
    render(<LoadingUI variant="skeleton" loadingText="Skeleton Loading" />);

    // Skeleton variant doesn't display the loading text
    expect(screen.queryByText("Skeleton Loading")).not.toBeInTheDocument();

    // Check for skeleton elements
    const container = screen.getByRole("generic");
    expect(container).toHaveClass("space-y-4");

    // Check for animate-pulse elements
    const pulseElements = document.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("should apply custom className when provided", () => {
    render(
      <LoadingUI
        variant="default"
        loadingText="Custom Class"
        className="custom-test-class"
      />
    );

    const container = screen.getByText("Custom Class").parentElement;
    expect(container).toHaveClass("custom-test-class");
  });
});
