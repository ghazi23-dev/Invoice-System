import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import {
  BadgeCheck,
  Banknote,
  CalendarClock,
  FileText,
  HandCoins,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import QuittancePDF from "../DashboardBi/QuittancePDF";
import PaymentForm from "./PaymentForm";
import { DataTable } from "@/Components/ui/data-table";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { NativeSelect } from "@/Components/ui/native-select";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { StatCard } from "@/Components/ui/stat-card";
import { ConfirmDialog } from "@/Components/ui/confirm-dialog";
import { RowActions } from "@/Components/ui/row-actions";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const modeBadge = {
  "Espèces": "success",
  "Chèque": "warning",
  "Virement": "default",
  "Carte": "violet",
};

/**
 * Règlements — record and track payments against invoices.
 * `previewData` (dev/preview hook) skips the fetch and renders the given rows.
 */
const Reglements = ({ previewData = null }) => {
  const [data, setData] = useState(previewData || []);
  const [loading, setLoading] = useState(!previewData);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (previewData) return undefined;
    fetchData();
    return undefined;
  }, [previewData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/v1/getReglements");
      const reglements = response.data.success ? response.data.reglements : response.data || [];
      setData(reglements);
    } catch (error) {
      console.error("Error fetching reglements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/deleteReglement/${deleteItemId}`);
      setData(data.filter((item) => item.ReglementID !== deleteItemId));
      toast.success("Règlement supprimé — statut de la facture recalculé.");
    } catch (error) {
      console.error("Error deleting reglement:", error);
      toast.error("Erreur lors de la suppression du règlement.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const settledByInvoice = useMemo(() => {
    const sums = {};
    data.forEach((r) => {
      sums[r.InvoiceID] = (sums[r.InvoiceID] || 0) + Number(r.Montant);
    });
    return sums;
  }, [data]);

  const handleQuittance = async (row) => {
    try {
      const total = Number(row.Invoice?.TotalAmount || 0);
      // Amounts settled on the same invoice BEFORE this reglement (chronological)
      const paidBefore = data
        .filter((r) => r.InvoiceID === row.InvoiceID && r.ReglementID !== row.ReglementID && new Date(r.CreatedAt) <= new Date(row.CreatedAt))
        .reduce((sum, r) => sum + Number(r.Montant), 0);
      const resteApres = Math.max(0, total - paidBefore - Number(row.Montant));

      const blob = await pdf(
        <QuittancePDF
          reglement={{ ...row, resteApres }}
          invoice={row.Invoice || { invoiceNumber: row.invoiceNumber, customerName: row.customerName }}
        />
      ).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Quittance_${row.Invoice?.invoiceNumber || row.ReglementID}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Quittance générée avec succès.");
    } catch (error) {
      console.error("Error generating quittance:", error);
      toast.error("Erreur lors de la génération de la quittance.");
    }
  };

  // ---------------- Filters ----------------
  const modeOptions = useMemo(() => [...new Set(data.map((r) => r.Mode).filter(Boolean))], [data]);
  const activeFilters = (quickFilter ? 1 : 0) + (modeFilter ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  const resetFilters = () => {
    setQuickFilter("");
    setModeFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const filteredData = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    return data.filter((r) => {
      const matchesSearch =
        !q ||
        String(r.Invoice?.invoiceNumber || "").toLowerCase().includes(q) ||
        String(r.Invoice?.customerName || "").toLowerCase().includes(q) ||
        String(r.Reference || "").toLowerCase().includes(q);
      const matchesMode = !modeFilter || r.Mode === modeFilter;
      const date = String(r.DateReglement || "").slice(0, 10);
      const matchesFrom = !dateFrom || date >= dateFrom;
      const matchesTo = !dateTo || date <= dateTo;
      return matchesSearch && matchesMode && matchesFrom && matchesTo;
    });
  }, [data, quickFilter, modeFilter, dateFrom, dateTo]);

  // ---------------- Statistics ----------------
  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    let total = 0;
    let monthTotal = 0;
    let monthCount = 0;
    const soldInvoiceIds = new Set();

    data.forEach((r) => {
      const amount = Number(r.Montant) || 0;
      total += amount;
      if (String(r.DateReglement || "").slice(0, 7) === monthKey) {
        monthTotal += amount;
        monthCount += 1;
      }
      if (r.Invoice?.Status === "Paid") soldInvoiceIds.add(r.InvoiceID);
    });

    return { total, monthTotal, monthCount, soldCount: soldInvoiceIds.size };
  }, [data]);

  // ---------------- Table ----------------
  const columns = [
    {
      key: "ReglementID",
      header: "N°",
      sortable: true,
      sortValue: (r) => Number(r.ReglementID),
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">#{r.ReglementID}</span>,
    },
    {
      key: "invoiceNumber",
      header: "Facture",
      sortable: true,
      sortValue: (r) => r.Invoice?.invoiceNumber || "",
      render: (r) => (
        <span className="font-mono text-xs font-semibold">{r.Invoice?.invoiceNumber || "—"}</span>
      ),
    },
    {
      key: "customerName",
      header: "Client",
      render: (r) => (
        <span className="block max-w-[220px] truncate font-medium" title={r.Invoice?.customerName}>
          {r.Invoice?.customerName || "—"}
        </span>
      ),
    },
    {
      key: "Montant",
      header: "Montant (TND)",
      sortable: true,
      sortValue: (r) => Number(r.Montant),
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <span className="whitespace-nowrap font-semibold tabular-nums">{Number(r.Montant).toFixed(3)}</span>
      ),
    },
    {
      key: "Mode",
      header: "Mode",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (r) => (r.Mode ? <Badge variant={modeBadge[r.Mode] || "secondary"}>{r.Mode}</Badge> : null),
    },
    {
      key: "DateReglement",
      header: "Date",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.DateReglement)}</span>,
    },
    {
      key: "Reference",
      header: "Référence",
      render: (r) => <span className="block max-w-[160px] truncate text-xs text-muted-foreground">{r.Reference || "—"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <RowActions onDelete={() => { setDeleteItemId(r.ReglementID); setDeleteModalVisible(true); }}>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Télécharger la quittance"
            onClick={() => handleQuittance(r)}
            className="text-muted-foreground hover:text-primary"
          >
            <FileText />
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        icon={HandCoins}
        title="Règlements"
        description="Encaissez et suivez les paiements de vos factures."
        actions={
          <Button onClick={() => setPaymentOpen(true)}>
            <Plus /> Nouveau règlement
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total encaissé"
          value={`${stats.total.toFixed(3)} TND`}
          icon={Banknote}
          tone="primary"
          hint={`${data.length} règlement(s) enregistré(s)`}
        />
        <StatCard
          label="Encaissé ce mois-ci"
          value={`${stats.monthTotal.toFixed(3)} TND`}
          icon={CalendarClock}
          tone="success"
          hint={`${stats.monthCount} règlement(s) ce mois`}
        />
        <StatCard
          label="Factures soldées"
          value={String(stats.soldCount)}
          icon={BadgeCheck}
          tone="violet"
          hint="Statut Payée atteint via règlements"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="col-span-2">
              <Input
                icon={Search}
                placeholder="Rechercher par facture, client ou référence…"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="h-9"
              />
            </div>
            <NativeSelect
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              placeholder="Tous les modes"
              className="h-9 text-[13px]"
              aria-label="Filtrer par mode de paiement"
            >
              {modeOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </NativeSelect>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 text-[13px]"
              aria-label="Date de début"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 text-[13px]"
              aria-label="Date de fin"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="m-0 text-xs text-muted-foreground">
              {activeFilters
                ? `${filteredData.length} règlement(s) correspondent aux ${activeFilters} filtre(s) actif(s)`
                : `${data.length} règlement(s) au total`}
            </p>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RotateCcw /> Réinitialiser les filtres ({activeFilters})
              </Button>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.ReglementID}
          loading={loading}
          pageSize={20}
          pageSizeOptions={[20, 50, 100]}
          label="règlements"
          emptyTitle="Aucun règlement trouvé"
          emptyDescription="Enregistrez votre premier règlement pour suivre les encaissements."
          className={cn(loading && !data.length && "opacity-60")}
        />
      </Card>

      <PaymentForm
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={fetchData}
      />

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer ce règlement ?"
        description="Le statut de la facture sera recalculé automatiquement."
      />
    </>
  );
};

export default Reglements;
