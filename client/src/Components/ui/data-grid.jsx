import { forwardRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";

const localeText = {
  page: "Page",
  of: "sur",
  to: "à",
  more: "plus",
  next: "Suivant",
  last: "Dernier",
  first: "Premier",
  previous: "Précédent",
  pageSizeSelectorLabel: "Lignes par page :",
  noRowsToShow: "Aucune donnée à afficher",
  loadingOoo: "Chargement…",
  filterOoo: "Filtrer…",
  contains: "Contient",
  notContains: "Ne contient pas",
  equals: "Égal à",
  notEqual: "Différent de",
  startsWith: "Commence par",
  endsWith: "Se termine par",
  blank: "Vide",
  notBlank: "Non vide",
  lessThan: "Inférieur à",
  greaterThan: "Supérieur à",
  inRange: "Entre",
  andCondition: "ET",
  orCondition: "OU",
  applyFilter: "Appliquer",
  resetFilter: "Réinitialiser",
  clearFilter: "Effacer",
  searchOoo: "Rechercher…",
  selectAll: "Tout sélectionner",
};

/**
 * AG Grid with the app's Quartz theme (follows the light/dark tokens).
 * Accepts every AgGridReact prop; `height` sets the container height.
 */
export const DataGrid = forwardRef(function DataGrid({ height = 620, className, defaultColDef, ...props }, ref) {
  return (
    <div className={cn("ag-theme-quartz app-grid w-full", className)} style={{ height }}>
      <AgGridReact
        ref={ref}
        localeText={localeText}
        animateRows
        defaultColDef={{ sortable: true, filter: true, resizable: true, ...defaultColDef }}
        {...props}
      />
    </div>
  );
});
