import { Dialog as HDialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
};

/**
 * Modal dialog.
 *   <Modal open onClose title description icon size="lg" footer={<Button/>}>body</Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "md",
  footer,
  children,
  className,
  bodyClassName,
}) {
  return (
    <HDialog open={!!open} onClose={() => onClose?.()} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity duration-200 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center sm:items-center sm:p-4">
          <DialogPanel
            transition
            className={cn(
              "relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl border bg-card text-card-foreground shadow-pop transition duration-200 ease-out data-[closed]:translate-y-4 data-[closed]:opacity-0 sm:max-h-[90vh] sm:rounded-2xl sm:data-[closed]:translate-y-0 sm:data-[closed]:scale-95",
              sizes[size] || sizes.md,
              className
            )}
          >
            {(title || description) && (
              <div className="flex items-start gap-3 border-b px-6 py-4">
                {Icon && (
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {title && <DialogTitle className="m-0 text-base font-semibold">{title}</DialogTitle>}
                  {description && (
                    <Description className="m-0 mt-0.5 text-sm text-muted-foreground">{description}</Description>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="-mr-2 rounded-md bg-transparent p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className={cn("nice-scroll flex-1 overflow-y-auto px-6 py-5", bodyClassName)}>{children}</div>
            {footer && (
              <div className="flex flex-col-reverse gap-2 border-t bg-muted/40 px-6 py-3.5 sm:flex-row sm:justify-end">
                {footer}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </HDialog>
  );
}
