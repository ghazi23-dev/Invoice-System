import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-sun-700 dark:text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
};

/** KPI tile: label, big value, icon chip and optional footnote. */
export function StatCard({ label, value, icon: Icon, tone = "primary", hint, className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-pop",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="m-0 mt-2 truncate text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        {Icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {hint && <p className="m-0 mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
