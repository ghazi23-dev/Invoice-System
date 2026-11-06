import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import {
  Banknote,
  CalendarClock,
  Clock,
  CreditCard,
  Download,
  FileText,
  Landmark,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Auth/AxiosInstance";
import PDFRenderComponent from "../DashboardBi/Row_PDF_Reglement_Quittance";
import PDFRenderComponentCreditedTemplate from "../DashboardBi/FactureAvoirComponent";
import PaymentForm from "../Reglements/PaymentForm";
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

const statusOptions = [
  { value: "Paid", label: "Payée" },
  { value: "Unpaid", label: "Impayée" },
  { value: "Pending", label: "Partiellement payée" },
];

const statusLabel = (value) => statusOptions.find((o) => o.value === value)?.label || value;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/v1/getInvoices");

      const invoices = response.data.success ? response.data.invoices : response.data;
      // Format the dueDate properly
      const formattedInvoices = invoices.map((invoice) => ({
        ...invoice,
        dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
        InvoiceDate: new Date(invoice.InvoiceDate).toISOString().split("T")[0],
      }));
      setData(formattedInvoices);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/deleteInvoice/${deleteItemId}`);
      setData(data.filter((item) => item.InvoiceID !== deleteItemId));
      setSelectedIds((ids) => ids.filter((id) => id !== deleteItemId));
      toast.success(`Facture supprimée avec succès ! ${response.data.invoiceNumber}`);
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Erreur du serveur.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const viewInvoice1 = async (InvoiceID) => {
    try {
      const response = await axiosInstance.get(`/api/v1/getInvoiceByID/${InvoiceID}`);
      const invoice = response.data.success ? response.data.invoice : response.data;
      navigate(`/Dashboard/ListeFactures/${InvoiceID}`); // Navigate to the new route
      return invoice;
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  const handleDownloadInvoiceAvoir = async (invoiceID, invoiceNumber) => {
    setDownloadInvoiceID(invoiceID);

    // Generate the PDF
    const blob = await pdf(
      <PDFRenderComponentCreditedTemplate record={data.find((item) => item.InvoiceID === invoiceID)} />
    ).toBlob();

    // Create form data
    const formData = new FormData();
    formData.append("file", blob, `Invoice_${invoiceNumber}.pdf`);

    // Once generated, trigger the download
    try {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`PDF généré avec succès ! Facture N° : ${invoiceNumber}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Erreur lors de la génération du PDF.");
    }
  };

  const handleDownloadClick = async (invoiceID, invoiceNumber) => {
    setDownloadInvoiceID(invoiceID);

    // Generate the PDF
    const blob = await pdf(
      <PDFRenderComponent record={data.find((item) => item.InvoiceID === invoiceID)} />
    ).toBlob();

    // Create form data
    const formData = new FormData();
    formData.append("file", blob, `Invoice_${invoiceNumber}.pdf`);

    // Once generated, trigger the download
    try {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`PDF généré avec succès ! Facture N° : ${invoiceNumber}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Erreur lors de la génération du PDF.");
    }
  };

  const HandleNavigation = () => {
    navigate("/Dashboard/DashboardBi");
  };

  // ---------------- Filters ----------------
  const typeOptions = useMemo(
    () => [...new Set(data.map((i) => i.InvoiceType).filter(Boolean))],
    [data]
  );
  const productOptions = useMemo(
    () => [...new Set(data.map((i) => i.DescriptionProduct).filter(Boolean))],
    [data]
  );

  const activeFilters =
    (search ? 1 : 0) +
    (statusFilter ? 1 : 0) +
    (typeFilter ? 1 : 0) +
    (productFilter ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setProductFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((inv) => {
      const matchesSearch =
        !q ||
        String(inv.invoiceNumber || "").toLowerCase().includes(q) ||
        String(inv.customerName || "").toLowerCase().includes(q);
      const matchesStatus = !statusFilter || inv.Status === statusFilter;
      const matchesType = !typeFilter || inv.InvoiceType === typeFilter;
      const matchesProduct = !productFilter || inv.DescriptionProduct === productFilter;
      const matchesFrom = !dateFrom || (inv.InvoiceDate || "") >= dateFrom;
      const matchesTo = !dateTo || (inv.InvoiceDate || "") <= dateTo;
      return matchesSearch && matchesStatus && matchesType && matchesProduct && matchesFrom && matchesTo;
    });
  }, [data, search, statusFilter, typeFilter, productFilter, dateFrom, dateTo]);

  const selectedRows = useMemo(
    () => data.filter((inv) => selectedIds.includes(inv.InvoiceID)),
    [data, selectedIds]
  );

  // ---------------- Statistics ----------------
  const calculateStatistics = () => {
    if (!data || data.length === 0)
      return {
        paidInvoices: "0.000",
        overdueAmount: "0.000",
        avgPaymentDays: "0",
        lastYearAmount: "0.000",
        lastYearPercentage: "0",
        avoirAmount: "0.000",
      };

    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Calculate total amount of "Avoir" invoices
    const avoirAmount = data
      .filter((invoice) => invoice.InvoiceType === "Avoir")
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    // Calculate paid invoices total
    const paidInvoices = data
      .filter((invoice) => invoice.Status === "Paid")
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    // Calculate overdue amount
    const overdueAmount = data
      .filter((invoice) => {
        const dueDate = new Date(invoice.dueDate);
        return invoice.Status !== "Paid" && dueDate < currentDate;
      })
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    // Calculate average payment days
    const paidInvoicesWithDates = data.filter((invoice) => invoice.Status === "Paid");
    const avgDays =
      paidInvoicesWithDates.length > 0
        ? paidInvoicesWithDates.reduce((sum, invoice) => {
            const dueDate = new Date(invoice.dueDate);
            const invoiceDate = new Date(invoice.InvoiceDate);
            return sum + Math.ceil((dueDate - invoiceDate) / (1000 * 60 * 60 * 24));
          }, 0) / paidInvoicesWithDates.length
        : 0;

    // Calculate last year's amount and percentage change
    const lastYearTotal = data
      .filter((invoice) => new Date(invoice.InvoiceDate) >= oneYearAgo)
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    const previousYearTotal = data
      .filter((invoice) => {
        const invoiceDate = new Date(invoice.InvoiceDate);
        const twoYearsAgo = new Date(oneYearAgo);
        twoYearsAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return invoiceDate >= twoYearsAgo && invoiceDate < oneYearAgo;
      })
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    const percentageChange =
      previousYearTotal !== 0 ? ((lastYearTotal - previousYearTotal) / previousYearTotal) * 100 : 0;

    return {
      paidInvoices: paidInvoices.toFixed(3),
      overdueAmount: overdueAmount.toFixed(3),
      avgPaymentDays: Math.round(avgDays),
      lastYearAmount: lastYearTotal.toFixed(3),
      lastYearPercentage: percentageChange.toFixed(1),
      avoirAmount: avoirAmount.toFixed(3),
    };
  };

  const stats = calculateStatistics();

  const summaryCards = [
    {
      title: "Factures payées",
      value: stats.paidInvoices,
      suffix: "TND",
      icon: CreditCard,
      tone: "success",
    },
    {
      title: "En retard",
      value: stats.overdueAmount,
      suffix: "TND",
      icon: Landmark,
      tone: "warning",
    },
    {
      title: "Moy. de réglement",
      value: stats.avgPaymentDays,
      suffix: "journée(s)",
      icon: CalendarClock,
      tone: "primary",
    },
    {
      title: "Facture avoir",
      value: stats.avoirAmount,
      suffix: "TND",
      icon: Receipt,
      tone: "violet",
    },
    {
      title: "Une année en arrière",
      value: stats.lastYearAmount,
      suffix: `TND (${stats.lastYearPercentage}%)`,
      icon: Clock,
      tone: "accent",
    },
  ];

  // ---------------- Actions ----------------
  const HandleInvoiceAvoirSend = async () => {
    const toastId = toast.loading("Création des factures d'avoir en cours…");

    try {
      if (selectedRows.length === 0) {
        toast.warning("Veuillez sélectionner au moins une facture");
        toast.dismiss(toastId);
        return;
      }

      for (const invoice of selectedRows) {
        // Skip if invoice is already an "Avoir"
        if (invoice.InvoiceType === "Avoir") {
          toast.warning(`La facture ${invoice.invoiceNumber} est déjà une facture d'avoir`);
          continue;
        }

        try {
          // Create credit invoice
          const response = await axiosInstance.post("/api/v1/create-credit-invoice", {
            originalInvoiceID: invoice.InvoiceID,
          });

          // Check if we have a response
          if (response && response.data) {
            const blob = await pdf(
              <PDFRenderComponentCreditedTemplate
                record={{
                  ...invoice,
                  ...response.data.creditInvoice,
                  originalInvoiceNumber: invoice.invoiceNumber,
                  originalInvoiceDate: invoice.InvoiceDate,
                }}
              />
            ).toBlob();

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `Avoir_${invoice.invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Facture d'avoir créée avec succès pour la facture N° : ${invoice.invoiceNumber}`);
          }
        } catch (error) {
          // Handle the specific error from the server
          const errorMessage = error.response?.data?.error || error.message;
          toast.error(errorMessage);
        }
      }

      // Refresh the grid data
      await fetchData();

      // Clear selection
      setSelectedIds([]);
    } catch (error) {
      console.error("Error creating credit invoices:", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la création des factures d'avoir";
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // ---------------- Table ----------------
  const isOverdue = (inv) => inv.Status !== "Paid" && inv.dueDate && new Date(inv.dueDate) < new Date();

  const columns = [
    {
      key: "invoiceNumber",
      header: "N° Facture",
      sortable: true,
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.invoiceNumber}</span>,
    },
    {
      key: "InvoiceType",
      header: "Type",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (r) =>
        r.InvoiceType ? <Badge variant={r.InvoiceType === "Avoir" ? "violet" : "default"}>{r.InvoiceType}</Badge> : null,
    },
    {
      key: "customerName",
      header: "Client",
      sortable: true,
      render: (r) => (
        <span className="block max-w-[220px] truncate font-medium" title={r.customerName}>
          {r.customerName}
        </span>
      ),
    },
    {
      key: "Status",
      header: "Statut",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (r) =>
        r.Status ? (
          <Badge variant={r.Status === "Paid" ? "success" : "destructive"} dot>
            {statusLabel(r.Status)}
          </Badge>
        ) : null,
    },
    {
      key: "InvoiceDate",
      header: "Facturation",
      sortable: true,
      render: (r) => <span className="text-muted-foreground">{formatDate(r.InvoiceDate)}</span>,
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortable: true,
      render: (r) => (
        <span className={cn("whitespace-nowrap", isOverdue(r) ? "font-semibold text-destructive" : "text-muted-foreground")}>
          {formatDate(r.dueDate)}
          {isOverdue(r) && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
              En retard
            </span>
          )}
        </span>
      ),
    },
    {
      key: "DescriptionProduct",
      header: "Produit",
      render: (r) => (r.DescriptionProduct ? <Badge variant="secondary">{r.DescriptionProduct}</Badge> : null),
    },
    {
      key: "TotalAmount",
      header: "Montant (TND)",
      sortable: true,
      sortValue: (r) => Number(r.TotalAmount),
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => <span className="whitespace-nowrap font-semibold tabular-nums">{Number(r.TotalAmount).toFixed(3)}</span>,
    },
    {
      key: "CreatedAt",
      header: "Créée le",
      sortable: true,
      render: (r) => (
        <span className="whitespace-nowrap text-xs text-muted-foreground">{new Date(r.CreatedAt).toLocaleString("fr-FR")}</span>
      ),
    },
    {
      key: "UpdatedAt",
      header: "Mise à jour",
      sortable: true,
      render: (r) => (
        <span className="whitespace-nowrap text-xs text-muted-foreground">{new Date(r.UpdatedAt).toLocaleString("fr-FR")}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <RowActions
          onView={() => viewInvoice1(r.InvoiceID)}
          onDelete={() => {
            setDeleteModalVisible(true);
            setDeleteItemId(r.InvoiceID);
          }}
        >
          {r.InvoiceType !== "Avoir" && r.Status !== "Paid" && (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Encaisser un règlement"
              onClick={() => setPaymentInvoice(r)}
              className="text-muted-foreground hover:text-primary"
            >
              <Banknote />
            </Button>
          )}
          {r.InvoiceType === "Avoir" ? (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Télécharger la facture d'avoir"
              onClick={() => handleDownloadInvoiceAvoir(r.InvoiceID, r.invoiceNumber)}
              className="text-muted-foreground hover:text-primary"
            >
              <FileText />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              title="Télécharger la facture"
              onClick={() => handleDownloadClick(r.InvoiceID, r.invoiceNumber)}
              className="text-muted-foreground hover:text-primary"
            >
              <Download />
            </Button>
          )}
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        icon={Receipt}
        title="Liste des factures"
        description="Filtrez, recherchez et téléchargez vos factures."
        actions={
          <Button onClick={HandleNavigation}>
            <Plus /> Nouvelle facture
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <StatCard
            key={card.title}
            label={card.title}
            value={`${card.value} ${card.suffix}`}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <Card className="overflow-hidden">
        {/* ---------------- Filter bar ---------------- */}
        <div className="flex flex-col gap-3 border-b p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
            <div className="col-span-2">
              <Input
                icon={Search}
                placeholder="Rechercher par N° facture ou client…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Tous les statuts"
              className="h-9 text-[13px]"
              aria-label="Filtrer par statut"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder="Tous les types"
              className="h-9 text-[13px]"
              aria-label="Filtrer par type"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="Tous les produits"
              className="h-9 text-[13px]"
              aria-label="Filtrer par produit"
            >
              {productOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </NativeSelect>
            <div className="relative">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 pr-8 text-[13px]"
                aria-label="Date de début"
              />
            </div>
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
                ? `${filteredData.length} facture(s) correspondent aux ${activeFilters} filtre(s) actif(s)`
                : `${data.length} facture(s) au total`}
            </p>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RotateCcw /> Réinitialiser les filtres ({activeFilters})
              </Button>
            )}
          </div>
        </div>

        {/* ---------------- Selection bar ---------------- */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b bg-primary/5 px-4 py-2.5">
            <Badge variant="default">{selectedIds.length} sélectionnée(s)</Badge>
            <Button variant="accent" size="sm" onClick={HandleInvoiceAvoirSend}>
              <FileText /> Convertir en avoir
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              <X /> Effacer la sélection
            </Button>
          </div>
        )}

        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.InvoiceID}
          loading={loading}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          label="factures"
          emptyTitle="Aucune facture trouvée"
          emptyDescription="Modifiez vos filtres ou votre recherche pour voir plus de résultats."
        />
      </Card>

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer cette facture ?"
        description="Cette action est définitive et ne peut pas être annulée."
      />

      <PaymentForm
        isOpen={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        invoice={paymentInvoice}
        onSuccess={fetchData}
      />
    </>
  );
};

export default App;
