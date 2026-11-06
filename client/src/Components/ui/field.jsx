import { cn } from "@/lib/utils";
import { Label } from "./label";

/** Form row: label + control + error/hint. */
export function Field({ label, htmlFor, required, error, hint, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p className="m-0 text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="m-0 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** Returns the formik error for `name` only once the field has been touched. */
export const fieldError = (formik, name) =>
  formik.touched?.[name] && formik.errors?.[name] ? formik.errors[name] : undefined;

/** Spreads name/value/onChange/onBlur/invalid for a formik-controlled input. */
export const bindField = (formik, name) => ({
  id: name,
  name,
  value: formik.values?.[name] ?? "",
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
  invalid: !!fieldError(formik, name),
});
