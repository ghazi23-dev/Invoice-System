import { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const LABELS = {
  home: "Tableau de bord",
  agent: "Agents",
  agence: "Agence",
  dashboardbi: "Nouvelle facture",
  produit_reservation: "Produits",
  listefactures: "Factures",
  listefactureqq: "Factures (archive)",
  client: "Clients",
  pdf: "Documents PDF",
};

const HIDDEN = ["dashboard", "produits", "tresorerie", "factureview"];

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts
    .map((value, index) => ({ value, to: "/" + parts.slice(0, index + 1).join("/") }))
    .filter(({ value }) => !HIDDEN.includes(value.toLowerCase()))
    .map(({ value, to }, i, arr) => ({
      to,
      isLast: i === arr.length - 1,
      label:
        LABELS[value.toLowerCase()] ??
        (arr[i - 1]?.value.toLowerCase() === "listefactures" ? `Facture #${decodeURIComponent(value)}` : decodeURIComponent(value)),
    }));

  return (
    <nav aria-label="Fil d'Ariane" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link
        to="/Dashboard/Home"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Accueil"
      >
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((c) => (
        <Fragment key={c.to}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          {c.isLast ? (
            <span className="truncate font-medium text-foreground">{c.label}</span>
          ) : (
            <Link to={c.to} className="truncate text-muted-foreground transition-colors hover:text-foreground">
              {c.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
