import React from "react";
import { render, screen } from "@testing-library/react";
import { withClientComponent } from "../withClientComponent";
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

describe("withClientComponent", () => {
  it("should wrap component with ClientComponentWrapper", () => {
    const WrappedComponent = withClientComponent(TestComponent);
    render(<WrappedComponent text="Wrapped Content" />);

    // The loading text should be visible (default loading text)
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should pass custom options to ClientComponentWrapper", () => {
    const WrappedComponent = withClientComponent(TestComponent, {
      loadingText: "Custom Loading Text",
      variant: "minimal",
    });
    render(<WrappedComponent text="Wrapped Content" />);

    // The custom loading text should be visible
    expect(screen.getByText("Custom Loading Text")).toBeInTheDocument();
  });

  it("should preserve component props", () => {
    // Mock React.Suspense to immediately render children instead of fallback
    jest
      .spyOn(React, "Suspense")
      .mockImplementation(({ children }) => <>{children}</>);

    const WrappedComponent = withClientComponent(TestComponent);
    render(<WrappedComponent text="Prop Test" />);

    // The component should receive its props
    expect(screen.getByText("Prop Test")).toBeInTheDocument();
  });

  it("should set a proper displayName", () => {
    const WrappedComponent = withClientComponent(TestComponent);
    expect(WrappedComponent.displayName).toBe(
      "withClientComponent(TestComponent)"
    );
  });
});
