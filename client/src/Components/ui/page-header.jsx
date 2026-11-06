import { cn } from "@/lib/utils";

/** Page title row with optional icon, description and right-aligned actions. */
export function PageHeader({ title, description, icon: Icon, actions, className }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/25">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="m-0 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {description && <p className="m-0 mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
