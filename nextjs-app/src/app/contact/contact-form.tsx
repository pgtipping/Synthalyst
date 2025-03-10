import React, { useState } from "react";
import { toast } from "react-hot-toast";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "submitting" | "success" | "error"
  >("submitting");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("submitting");

    try {
      // Extract reference number if present in subject
      const referenceMatch = subject.match(/\[(REF-[A-Z0-9-]+)\]/);
      const reference = referenceMatch ? referenceMatch[1] : null;

      const response = await fetch("/api/contact-submissions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          reference, // Add reference to the submission
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmissionStatus("success");

      // Show success message
      toast.success(
        reference
          ? "Your reply has been submitted successfully. We'll process it as part of your existing conversation."
          : "Your message has been submitted successfully. We'll get back to you soon."
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div>{/* Render your form here */}</div>;
};

export default ContactForm;
