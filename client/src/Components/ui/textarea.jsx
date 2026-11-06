import * as React from "react";
import { cn } from "@/lib/utils";
import { inputClasses } from "./input";

const Textarea = React.forwardRef(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(inputClasses, "h-auto min-h-[88px] resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
