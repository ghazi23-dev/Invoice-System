/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  ReceiptText,
  HandCoins,
  Building2,
  UserCog,
  Users,
  PackageOpen,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// `admin: true` → Owner only, `agentOnly: true` → non-Owner only.
const NAV = [
  {
    section: "Général",
    items: [
      { to: "/Dashboard/Home", label: "Tableau de bord", icon: LayoutDashboard, admin: true, end: true },
      { to: "/Dashboard/Home/Agent", label: "Tableau de bord", icon: LayoutDashboard, agentOnly: true },
    ],
  },
  {
    section: "Facturation",
    items: [
      { to: "/Dashboard/DashboardBi", label: "Nouvelle facture", icon: FilePlus2 },
      { to: "/Dashboard/ListeFactures", label: "Factures", icon: ReceiptText },
      { to: "/Dashboard/Reglements", label: "Règlements", icon: HandCoins, admin: true },
    ],
  },
  {
    section: "Gestion",
    items: [
      { to: "/Dashboard/Agence", label: "Agence", icon: Building2, admin: true },
      { to: "/Dashboard/Agent", label: "Agents", icon: UserCog, admin: true },
      { to: "/Dashboard/Client", label: "Clients", icon: Users, admin: true },
      { to: "/Dashboard/Produit_Reservation", label: "Produits", icon: PackageOpen, admin: true },
    ],
  },
  {
    section: "Paramètres",
    items: [{ to: "/Dashboard/PDF", label: "Documents PDF", icon: FileText }],
  },
];

const MenuList = ({ collapsed = false, onNavigate }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (userDetails) setIsAdmin(userDetails.Role === "Owner");
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }, []);

  const visible = NAV.map((group) => ({
    ...group,
    items: group.items.filter((i) => (i.admin ? isAdmin : i.agentOnly ? !isAdmin : true)),
  })).filter((g) => g.items.length);

  return (
    <nav className="flex flex-col gap-5">
      {visible.map((group) => (
        <div key={group.section} className="flex flex-col gap-1">
          {collapsed ? (
            <div className="mx-auto mb-1 h-px w-6 bg-sidebar-border" />
          ) : (
            <p className="m-0 mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted/70">
              {group.section}
            </p>
          )}
          {group.items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group relative flex h-10 items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150",
                  collapsed ? "justify-center px-0" : "px-3",
                  isActive
                    ? "bg-gradient-to-r from-brand-500/30 to-brand-500/5 text-white"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
                  )}
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      isActive ? "text-brand-300" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
};

export default MenuList;
