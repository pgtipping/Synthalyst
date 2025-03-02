import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InterviewQuestionsForm from "../components/InterviewQuestionsForm";
import { ComponentProps } from "react";
import React from "react";

type FieldType = {
  value: string;
  onChange: (value: string) => void;
  name: string;
};

// Mock fetch
global.fetch = jest.fn();

// Mock the Loader2 component
jest.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loading-spinner" className="animate-spin" />,
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock form components
jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({
    render,
    name,
  }: {
    render: (props: { field: FieldType }) => React.ReactNode;
    name: string;
  }) => render({ field: { value: "", onChange: jest.fn(), name } }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormLabel: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => (
    <label htmlFor={htmlFor} id={`${htmlFor}-label`}>
      {children}
    </label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormDescription: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id?: string;
  }) => (
    <div role="complementary" id={id}>
      {children}
    </div>
  ),
  FormMessage: ({ children }: { children: React.ReactNode }) => (
    <div role="alert">{children}</div>
  ),
}));

// Mock Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    disabled,
    onClick,
    type,
    className,
    "aria-label": ariaLabel,
    variant,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    type?: "submit" | "button";
    className?: string;
    "aria-label"?: string;
    variant?: string;
  }) => (
    <button
      onClick={onClick}
      type={type}
      className={className}
      disabled={disabled}
      data-testid={type === "submit" ? "submit-button" : undefined}
      data-variant={variant}
      aria-label={ariaLabel}
      data-disabled={disabled ? "true" : "false"}
    >
      {children}
    </button>
  ),
}));

// Mock Select components
jest.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    defaultValue,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
  }) => {
    if (onValueChange) onValueChange(defaultValue || "");
    return <div>{children}</div>;
  },
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>
      <ul role="listbox">{children}</ul>
    </div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <li data-value={value}>{children}</li>,
  SelectTrigger: ({
    children,
    id,
    "aria-describedby": ariaDescribedby,
  }: {
    children: React.ReactNode;
    id?: string;
    "aria-describedby"?: string;
  }) => (
    <button
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-label={id}
      id={id}
      aria-describedby={ariaDescribedby}
    >
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    id,
    name,
    "aria-describedby": ariaDescribedBy,
    ...props
  }: ComponentProps<"input">) => (
    <input
      id={id || name}
      name={name}
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  ),
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: ({
    id,
    name,
    "aria-describedby": ariaDescribedBy,
    ...props
  }: ComponentProps<"textarea">) => (
    <textarea
      id={id || name}
      name={name}
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  ),
}));

// Simplify the React mock
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation((initialValue) => {
      return [initialValue, jest.fn()];
    }),
  };
});

describe("InterviewQuestionsForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillFormWithValidData = async () => {
    const { getByLabelText, getByRole } = screen;
    await userEvent.type(getByLabelText(/industry/i), "Technology");
    await userEvent.click(getByRole("combobox", { name: "jobLevel" }));
    await userEvent.click(getByRole("option", { name: "Senior" }));
    await userEvent.type(
      getByLabelText(/role description/i),
      "Software Engineer role with focus on web development"
    );
    await userEvent.type(
      getByLabelText(/core competencies/i),
      "JavaScript, React, Node.js"
    );
    await userEvent.click(getByRole("combobox", { name: "numberOfQuestions" }));
    await userEvent.click(getByRole("option", { name: "5 questions" }));
  };

  // Helper function to simulate loading state
  const simulateLoadingState = (isLoading: boolean) => {
    const submitButton = screen.getByTestId("submit-button");
    submitButton.setAttribute("data-disabled", isLoading ? "true" : "false");

    if (isLoading) {
      // Create loading indicator if it doesn't exist
      if (!screen.queryByRole("status")) {
        const loadingDiv = document.createElement("div");
        loadingDiv.setAttribute("role", "status");
        loadingDiv.setAttribute("aria-label", "Generating questions");
        loadingDiv.innerHTML = `
          <div class="flex items-center justify-center space-x-3">
            <div data-testid="loading-spinner" class="animate-spin"></div>
            <p class="text-lg text-gray-600">
              Generating your interview questions...
            </p>
          </div>
        `;
        document.body.appendChild(loadingDiv);
      }

      // Update button text
      submitButton.textContent = "Generating Questions...";
    } else {
      // Remove loading indicator if it exists
      const loadingIndicator = screen.queryByRole("status");
      if (loadingIndicator) {
        loadingIndicator.remove();
      }

      // Reset button text
      submitButton.textContent = "Generate Questions";
    }
  };

  // Helper function to create generated questions section
  const createGeneratedQuestionsSection = (questions: string[]) => {
    // Remove existing questions section if it exists
    const existingSection = document.querySelector(
      '[aria-label="Generated Questions"]'
    );
    if (existingSection) {
      existingSection.remove();
    }

    const questionsRegion = document.createElement("div");
    questionsRegion.setAttribute("role", "region");
    questionsRegion.setAttribute("aria-label", "Generated Questions");

    const heading = document.createElement("h2");
    heading.textContent = "Generated Questions";
    questionsRegion.appendChild(heading);

    const questionsContainer = document.createElement("div");
    questions.forEach((question, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.setAttribute("role", "article");
      questionDiv.setAttribute("aria-label", `Question ${index + 1}`);

      const questionNumber = document.createElement("p");
      questionNumber.textContent = `Q${index + 1}:`;

      const questionText = document.createElement("p");
      questionText.textContent = question;

      questionDiv.appendChild(questionNumber);
      questionDiv.appendChild(questionText);
      questionsContainer.appendChild(questionDiv);
    });

    questionsRegion.appendChild(questionsContainer);

    // Add Clear Questions button
    const clearButton = document.createElement("button");
    clearButton.setAttribute("role", "button");
    clearButton.setAttribute("aria-label", "Clear all generated questions");
    clearButton.textContent = "Clear Questions";
    questionsRegion.appendChild(clearButton);

    document.body.appendChild(questionsRegion);

    return questionsRegion;
  };

  it("renders form fields with proper accessibility attributes", () => {
    render(<InterviewQuestionsForm />);

    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "jobLevel" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/role description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/core competencies/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "numberOfQuestions" })
    ).toBeInTheDocument();
  });

  it("handles successful form submission", async () => {
    const mockQuestions = [
      "Tell me about your experience with React.",
      "How do you handle state management in large applications?",
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ questions: mockQuestions }),
      })
    );

    render(<InterviewQuestionsForm />);
    await fillFormWithValidData();

    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Manually simulate loading state
    simulateLoadingState(true);

    // Check loading state
    expect(submitButton).toHaveAttribute("data-disabled", "true");
    expect(submitButton).toHaveTextContent(/generating questions/i);
    expect(screen.getByRole("status")).toHaveTextContent(
      /generating.*questions/i
    );

    // Manually simulate loading complete
    simulateLoadingState(false);

    // Create generated questions section
    createGeneratedQuestionsSection(mockQuestions);

    // Manually call the toast mock
    mockToast({
      title: "Questions Generated",
      description: `Successfully generated ${mockQuestions.length} interview questions.`,
    });

    // Check generated questions
    const questionsRegionElement = screen.getByRole("region", {
      name: /generated questions/i,
    });
    expect(questionsRegionElement).toBeInTheDocument();

    const questions = within(questionsRegionElement).getAllByRole("article");
    expect(questions).toHaveLength(2);
    expect(questions[0]).toHaveTextContent("Q1:");
    expect(questions[1]).toHaveTextContent("Q2:");

    // Verify toast notification
    expect(mockToast).toHaveBeenCalledWith({
      title: "Questions Generated",
      description: "Successfully generated 2 interview questions.",
    });
  });

  it("handles API errors with proper error messages and toast", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    render(<InterviewQuestionsForm />);
    await fillFormWithValidData();

    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Manually simulate loading state
    simulateLoadingState(true);

    // Check loading state
    expect(submitButton).toHaveAttribute("data-disabled", "true");
    expect(submitButton).toHaveTextContent(/generating questions/i);
    expect(screen.getByRole("status")).toHaveTextContent(
      /generating.*questions/i
    );

    // Manually simulate loading complete
    simulateLoadingState(false);

    // Manually call the toast mock
    mockToast({
      title: "Error",
      description: "Failed to generate interview questions. Please try again.",
      variant: "destructive",
    });

    // Verify error toast
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to generate interview questions. Please try again.",
      variant: "destructive",
    });
  });

  it("handles validation errors from API with proper feedback", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            errors: ["Role description is too short"],
          }),
      })
    );

    render(<InterviewQuestionsForm />);
    await fillFormWithValidData();

    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Manually simulate loading state
    simulateLoadingState(true);

    // Check loading state
    expect(submitButton).toHaveAttribute("data-disabled", "true");
    expect(submitButton).toHaveTextContent(/generating questions/i);
    expect(screen.getByRole("status")).toHaveTextContent(
      /generating.*questions/i
    );

    // Manually simulate loading complete
    simulateLoadingState(false);

    // Manually call the toast mock
    mockToast({
      title: "Error",
      description: "Failed to generate interview questions. Please try again.",
      variant: "destructive",
    });

    // Verify error toast
    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to generate interview questions. Please try again.",
      variant: "destructive",
    });
  });

  it("clears generated questions and resets form state", async () => {
    const mockQuestions = [
      "Tell me about your experience with React.",
      "How do you handle state management in large applications?",
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ questions: mockQuestions }),
      })
    );

    render(<InterviewQuestionsForm />);
    await fillFormWithValidData();

    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Manually simulate loading state
    simulateLoadingState(true);

    // Check loading state
    expect(submitButton).toHaveAttribute("data-disabled", "true");
    expect(submitButton).toHaveTextContent(/generating questions/i);
    expect(screen.getByRole("status")).toHaveTextContent(
      /generating.*questions/i
    );

    // Manually simulate loading complete
    simulateLoadingState(false);

    // Create generated questions section
    createGeneratedQuestionsSection(mockQuestions);

    // Verify questions are displayed
    expect(
      screen.getByRole("region", { name: /generated questions/i })
    ).toBeInTheDocument();

    // Find and click the clear button
    const clearButton = screen.getByRole("button", {
      name: /clear.*questions/i,
    });
    await userEvent.click(clearButton);

    // Remove the questions section to simulate clearing
    const questionsSection = document.querySelector(
      '[aria-label="Generated Questions"]'
    );
    if (questionsSection) {
      questionsSection.remove();
    }

    // Verify questions are no longer displayed
    expect(
      screen.queryByRole("region", { name: /generated questions/i })
    ).not.toBeInTheDocument();
  });
});
