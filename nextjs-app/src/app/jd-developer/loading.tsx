import { Spinner } from "@/components/ui/spinner";

export default function JDDeveloperLoading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <Spinner className="h-10 w-10 mb-4" />
        <p className="text-lg text-muted-foreground">Loading JD Developer...</p>
      </div>
    </div>
  );
}
