import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses } from "./input";

/**
 * Styled native <select>. Pass either `options` ([{value,label}] or strings)
 * or <option> children. `placeholder` adds an empty first option.
 */
const NativeSelect = React.forwardRef(({ className, options, placeholder, invalid, children, ...props }, ref) => (
  <div className="relative w-full">
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputClasses, "cursor-pointer appearance-none pr-9", className)}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options
        ? options.map((o) => {
            const opt = typeof o === "object" ? o : { value: o, label: o };
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })
        : children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
));
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
