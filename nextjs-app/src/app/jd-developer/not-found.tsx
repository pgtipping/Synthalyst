import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JDDeveloperNotFound() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h1 className="text-3xl font-bold mb-4">JD Developer Not Found</h1>
        <p className="text-lg mb-8 text-center">
          The Job Description Developer page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/jd-developer">Go to JD Developer</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
