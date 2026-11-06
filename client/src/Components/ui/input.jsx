import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/15 file:border-0 file:bg-transparent file:text-sm file:font-medium";

/**
 * Text input. Optional `icon` (a lucide component) renders on the left,
 * optional `trailing` node renders on the right. `invalid` sets the error style.
 */
const Input = React.forwardRef(({ className, type = "text", icon: Icon, trailing, invalid, ...props }, ref) => {
  const input = (
    <input
      type={type}
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputClasses, Icon && "pl-10", trailing && "pr-11", className)}
      {...props}
    />
  );
  if (!Icon && !trailing) return input;
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      {input}
      {trailing && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
