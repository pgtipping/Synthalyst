"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestComponent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get the current query parameters
  const currentParams = new URLSearchParams(searchParams?.toString() || "");
  const testParam = currentParams.get("test") || "No test parameter";

  // Function to add a test parameter
  const addTestParam = () => {
    const newParams = new URLSearchParams(searchParams?.toString() || "");
    newParams.set("test", `test-${Date.now()}`);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Function to clear parameters
  const clearParams = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Hook Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Current Pathname:</h3>
            <code className="bg-muted p-2 rounded block mt-1">{pathname}</code>
          </div>

          <div>
            <h3 className="font-medium">Current Search Parameters:</h3>
            <code className="bg-muted p-2 rounded block mt-1">
              {searchParams?.toString() || "No search parameters"}
            </code>
          </div>

          <div>
            <h3 className="font-medium">Test Parameter Value:</h3>
            <code className="bg-muted p-2 rounded block mt-1">{testParam}</code>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={addTestParam}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Add Test Parameter
        </button>

        <button
          onClick={clearParams}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Clear Parameters
        </button>
      </div>
    </div>
  );
}
