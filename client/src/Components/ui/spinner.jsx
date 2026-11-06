import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-primary", className)} />;
}

export function PageLoader({ label = "Chargement…", className }) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
        className
      )}
    >
      <Spinner className="h-7 w-7" />
      {label}
    </div>
  );
}
