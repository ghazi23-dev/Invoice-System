/* eslint-disable react/prop-types */
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "./button";

/** Compact icon buttons for grid rows. Pass only the handlers you need. */
export function RowActions({ onView, onEdit, onDelete, children }) {
  return (
    <div className="flex items-center gap-0.5">
      {onView && (
        <Button variant="ghost" size="icon-sm" title="Voir" onClick={onView} className="text-muted-foreground hover:text-primary">
          <Eye />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon-sm" title="Modifier" onClick={onEdit} className="text-muted-foreground hover:text-primary">
          <Pencil />
        </Button>
      )}
      {children}
      {onDelete && (
        <Button variant="ghost-destructive" size="icon-sm" title="Supprimer" onClick={onDelete} className="opacity-70 hover:opacity-100">
          <Trash2 />
        </Button>
      )}
    </div>
  );
}
