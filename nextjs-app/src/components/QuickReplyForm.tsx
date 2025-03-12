"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Define the schema for form validation
const quickReplySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters" }),
});

type QuickReplyFormData = z.infer<typeof quickReplySchema>;

interface QuickReplyFormProps {
  endpoint: string; // API endpoint to submit the form
  buttonText?: string;
  successMessage?: string;
  className?: string;
  includeMessage?: boolean; // Whether to include a message field
  onSuccess?: () => void; // Callback function on successful submission
  additionalFields?: {
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }[];
}

export default function QuickReplyForm({
  endpoint,
  buttonText = "Submit",
  successMessage = "Your message has been sent successfully!",
  className = "",
  includeMessage = true,
  onSuccess,
  additionalFields = [],
}: QuickReplyFormProps) {
  const [formData, setFormData] = useState<
    Partial<QuickReplyFormData> & Record<string, string>
  >({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    try {
      // Only validate fields that are included in the form
      const dataToValidate: Record<string, string> = {
        name: formData.name || "",
        email: formData.email || "",
      };

      if (includeMessage) {
        dataToValidate.message = formData.message || "";
      }

      // Create a dynamic schema based on included fields
      const dynamicSchema: Record<string, z.ZodTypeAny> = {
        name: quickReplySchema.shape.name,
        email: quickReplySchema.shape.email,
      };

      if (includeMessage) {
        dynamicSchema.message = quickReplySchema.shape.message;
      }

      // Add additional fields to validation if they're required
      additionalFields.forEach((field) => {
        if (field.required) {
          dynamicSchema[field.name] = z
            .string()
            .min(1, { message: `${field.label} is required` });
        } else {
          dynamicSchema[field.name] = z.string().optional();
        }

        // Add the field to validation data if it exists
        if (formData[field.name] !== undefined) {
          dataToValidate[field.name] = formData[field.name];
        }
      });

      // Create and run the validation
      const customSchema = z.object(dynamicSchema);
      customSchema.parse(dataToValidate);

      // If validation passes, submit the form
      setStatus("loading");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        // Reset additional fields
        additionalFields.forEach((field) => {
          setFormData((prev) => ({ ...prev, [field.name]: "" }));
        });

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      if (error instanceof z.ZodError) {
        // Format validation errors
        const errorMessages = error.errors
          .map((err) => `${err.message}`)
          .join(", ");
        setErrorMessage(errorMessages);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        console.error("Form submission error:", error);
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full"
              disabled={status === "loading"}
            />
          </div>
          <div>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full"
              disabled={status === "loading"}
            />
          </div>
        </div>

        {/* Additional fields */}
        {additionalFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalFields.map((field) => (
              <div key={field.name}>
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || field.label}
                  required={field.required}
                  className="w-full"
                  disabled={status === "loading"}
                />
              </div>
            ))}
          </div>
        )}

        {includeMessage && (
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            className="w-full min-h-[120px]"
            disabled={status === "loading"}
          />
        )}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full md:w-auto"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            buttonText
          )}
        </Button>

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
