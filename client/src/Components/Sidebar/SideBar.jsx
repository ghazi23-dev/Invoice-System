import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Bell, BellOff, ChevronsUpDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";

import Logo from "../../assets/Logo";
import MenuList from "./MenuList";
import ToggleThemeBtn from "./ToggleThemeBtn";
import Breadcrumb from "./Breadcumbs";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/Components/ui/dropdown-menu";

import ErrorPage from "../../pages/Error/Error";
import { fetchStockNotif } from "../../pages/Login/Login";
import PrivateRoute from "../../Auth/Auth";
import axiosInstance from "../../Auth/AxiosInstance";
import Dashboard from "../DashboardComp/Vente_Journaliere/Tableau_Vente_Journaliere";
import Agent from "../DashboardComp/Users/Agent";
import Agence from "../DashboardComp/Agence/Dashboard";
import Facturation from "../DashboardComp/DashboardBi/InvoiceComponent";
import Produit_Reservation from "../DashboardComp/Produit_Reservation/Produit_Reservation";
import Invoice_List from "../DashboardComp/DashboardBi/InvoiceList";
import ClientTiers from "../DashboardComp/ClientTiers/Client";
import InvoiceViewForm from "../DashboardComp/DashboardBi/InvoiceViewComponent";
import PDF from "../DashboardComp/PDF_Files/PDF";
import InvoiceListe from "../DashboardComp/Client_Agent_Dashboard/ListeInvoice";
import Reglements from "../DashboardComp/Reglements/Reglements";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

const SideBar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fullDisplayName, setFullDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      setFullDisplayName(userDetails.fullname || "");
      setRole(userDetails.Role || "");
    }
    const NotifMarked = localStorage.getItem("NotifMarked");
    if (NotifMarked === "false") {
      fetchStockNotif(setMessages, setNotificationCount);
      localStorage.setItem("NotifMarked", "false");
    } else if (NotifMarked === "true") {
      localStorage.removeItem("NotifMarked");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close the mobile drawer on navigation
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    axiosInstance
      .post("/api/v1/logout")
      .then(() => {
        setTimeout(() => navigate("/"), 2000);
        localStorage.removeItem("userDetails");
        localStorage.removeItem("NotifMarked");
        toast.success("Déconnexion réussie");
      })
      .catch((error) => console.log(error));
  };

  const MarkAsRead = () => {
    setNotificationCount(0);
    setMessages([]);
    localStorage.setItem("NotifMarked", "true");
  };

  const firstName = fullDisplayName.split(" ")[0];
  const roleLabel = role === "Owner" ? "Administrateur" : role || "Agent";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-300 ease-out",
          "bg-[radial-gradient(120%_60%_at_0%_0%,hsl(191_69%_39%/0.22),transparent_60%)]",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center", collapsed ? "lg:justify-center lg:px-0" : "", "px-5")}>
          <Logo collapsed={collapsed && !mobileOpen} />
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-md bg-transparent p-1.5 text-sidebar-muted hover:bg-sidebar-accent hover:text-white lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="nice-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <MenuList collapsed={collapsed && !mobileOpen} onNavigate={() => setMobileOpen(false)} />
        </div>

        <div className={cn("shrink-0 border-t border-sidebar-border p-4", collapsed && "lg:px-2")}>
          {collapsed && !mobileOpen ? (
            <p className="m-0 text-center text-[10px] font-semibold text-sidebar-muted/60">GSoft</p>
          ) : (
            <p className="m-0 text-[11px] text-sidebar-muted/70">
              Propulsé par <span className="font-semibold text-sidebar-muted">GSoft Innovations</span>
            </p>
          )}
        </div>
      </aside>

      {/* ---------------- Main column ---------------- */}
      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-300 ease-out", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
            <Menu />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-muted-foreground lg:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>

          <div className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden min-w-0 flex-1 sm:block">
            <Breadcrumb />
          </div>
          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-1">
            <ToggleThemeBtn isDark={isDark} toggleTheme={toggleTheme} />

            {/* Notifications */}
            <Popover className="relative">
              <PopoverButton
                as={Button}
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell />
                {notificationCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white ring-2 ring-background">
                    {notificationCount}
                  </span>
                )}
              </PopoverButton>
              <PopoverPanel
                transition
                anchor={{ to: "bottom end", gap: 8 }}
                className="z-50 w-80 rounded-xl border bg-popover text-popover-foreground shadow-pop transition duration-100 data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                {({ close }) => (
                  <>
                    <div className="flex items-center justify-between border-b px-4 py-3">
                      <p className="m-0 text-sm font-semibold">Notifications</p>
                      {notificationCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {notificationCount} nouvelle{notificationCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="nice-scroll max-h-80 overflow-y-auto p-2">
                      {messages.length ? (
                        messages.map((m, i) => (
                          <div key={i} className="flex gap-3 rounded-lg p-2.5 hover:bg-muted">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                              <AlertCircle className="h-4 w-4" />
                            </div>
                            <p className="m-0 text-sm leading-snug">{m}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                          <BellOff className="h-6 w-6 opacity-60" />
                          Aucune notification
                        </div>
                      )}
                    </div>
                    {messages.length > 0 && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            MarkAsRead();
                            close();
                          }}
                        >
                          Tout marquer comme lu
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </PopoverPanel>
            </Popover>

            {/* User menu */}
            <DropdownMenu>
              <DropdownTrigger className="ml-1 flex items-center gap-2.5 rounded-lg border-0 bg-transparent p-1 pr-2 text-left transition hover:bg-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-semibold text-white">
                  {initials(fullDisplayName)}
                </span>
                <span className="hidden leading-tight md:block">
                  <span className="block max-w-[140px] truncate text-sm font-medium">{fullDisplayName || "Utilisateur"}</span>
                  <span className="block text-xs text-muted-foreground">{roleLabel}</span>
                </span>
                <ChevronsUpDown className="hidden h-4 w-4 text-muted-foreground md:block" />
              </DropdownTrigger>
              <DropdownContent>
                <div className="px-2.5 py-2">
                  <p className="m-0 text-sm font-medium">Bonjour{firstName ? `, ${firstName}` : ""} 👋</p>
                  <p className="m-0 text-xs text-muted-foreground">{roleLabel}</p>
                </div>
                <DropdownSeparator />
                <DropdownItem icon={LogOut} destructive onClick={handleLogout}>
                  Déconnexion
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </div>
        </header>

        <main key={location.pathname} className="mx-auto w-full max-w-[1600px] flex-1 animate-fade-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Routes>
            <Route path="/Home" element={<PrivateRoute element={<Dashboard />} roles={["Owner"]} />} />
            <Route path="/Agent" element={<PrivateRoute element={<Agent />} roles={["Owner"]} />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/Agence" element={<PrivateRoute element={<Agence />} roles={["Owner"]} />} />
            <Route path="/DashboardBi" element={<PrivateRoute element={<Facturation />} roles={["Owner"]} />} />
            <Route path="/Produit_Reservation" element={<PrivateRoute element={<Produit_Reservation />} roles={["Owner"]} />} />
            <Route path="/ListeFactureQQ" element={<PrivateRoute element={<Invoice_List />} roles={["Owner"]} />} />
            <Route path="/Client" element={<PrivateRoute element={<ClientTiers />} roles={["Owner"]} />} />
            <Route path="/ListeFactures/:InvoiceID" element={<PrivateRoute element={<InvoiceViewForm />} roles={["Owner"]} />} />
            <Route path="/PDF" element={<PrivateRoute element={<PDF />} roles={["Owner"]} />} />
            <Route path="/ListeFactures" element={<PrivateRoute element={<InvoiceListe />} roles={["Owner"]} />} />
            <Route path="/Reglements" element={<PrivateRoute element={<Reglements />} roles={["Owner"]} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SideBar;
