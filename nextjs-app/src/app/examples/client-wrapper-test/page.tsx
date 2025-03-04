import { Metadata } from "next";
import { ClientComponentWrapper } from "@/components/wrappers/ClientComponentWrapper";
import TestComponent from "./test-component";

export const metadata: Metadata = {
  title: "Client Wrapper Test | Synthalyst",
  description:
    "Testing the ClientComponentWrapper with different navigation hooks",
};

export default function ClientWrapperTestPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">ClientComponentWrapper Test</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates the ClientComponentWrapper with different
        navigation hooks.
      </p>

      <div className="grid gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Component with Navigation Hooks
          </h2>
          <ClientComponentWrapper loadingText="Loading test component...">
            <TestComponent />
          </ClientComponentWrapper>
        </div>
      </div>
    </div>
  );
}
