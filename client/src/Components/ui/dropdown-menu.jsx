import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { cn } from "@/lib/utils";

export { Menu as DropdownMenu, MenuButton as DropdownTrigger };

export function DropdownContent({ className, anchor = "bottom end", children }) {
  return (
    <MenuItems
      transition
      anchor={{ to: anchor, gap: 8 }}
      className={cn(
        "z-50 min-w-[200px] origin-top-right rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-pop outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
        className
      )}
    >
      {children}
    </MenuItems>
  );
}

export function DropdownItem({ icon: Icon, destructive, className, children, ...props }) {
  return (
    <MenuItem>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg bg-transparent px-2.5 py-2 text-left text-sm data-[focus]:bg-muted",
          destructive ? "text-destructive data-[focus]:bg-destructive/10" : "text-foreground",
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 opacity-80" />}
        {children}
      </button>
    </MenuItem>
  );
}

export function DropdownSeparator() {
  return <MenuSeparator className="my-1 h-px bg-border" />;
}
