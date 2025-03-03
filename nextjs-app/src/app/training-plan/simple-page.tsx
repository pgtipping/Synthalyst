import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Training Plan | Synthalyst",
  description: "Simple training plan page",
};

export default function SimpleTrainingPlanPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Simple Training Plan Page</h1>
      <p className="mt-4">
        This is a simplified version of the training plan page.
      </p>
    </div>
  );
}
