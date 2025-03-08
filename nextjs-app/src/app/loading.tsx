import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Spinner className="h-10 w-10 mb-4" />
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}
