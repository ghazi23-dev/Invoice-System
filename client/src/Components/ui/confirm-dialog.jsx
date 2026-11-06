import { Dialog as HDialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

/** Small confirmation dialog for destructive actions. */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = "Êtes-vous sûr ?",
  description = "Cette action est irréversible.",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  variant = "destructive",
  loading = false,
}) {
  const danger = variant === "destructive";
  return (
    <HDialog open={!!open} onClose={() => onCancel?.()} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-pop transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div
            className={
              "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full " +
              (danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")
            }
          >
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="m-0 text-center text-base font-semibold">{title}</DialogTitle>
          {description && (
            <Description className="m-0 mt-1.5 text-center text-sm text-muted-foreground">{description}</Description>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant={danger ? "destructive" : "default"} onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </HDialog>
  );
}
