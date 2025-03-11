import { cn } from "@/lib/utils";

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="animate-bounce delay-0">.</span>
      <span className="animate-bounce delay-150">.</span>
      <span className="animate-bounce delay-300">.</span>
    </span>
  );
}
