import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import { Download, Receipt, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Auth/AxiosInstance";
import PDFRenderComponent from "./Row_PDF_Reglement_Quittance";
import { DataTable } from "@/Components/ui/data-table";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { ConfirmDialog } from "@/Components/ui/confirm-dialog";
import { RowActions } from "@/Components/ui/row-actions";
import { formatDate } from "@/lib/format";

const Invoice_List = () => {
  const [data, setData] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);
  const [quickFilter, setQuickFilter] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
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

  const handleDownloadClick = async (invoiceID, invoiceNumber) => {
    setDownloadInvoiceID(invoiceID);

    // Generate the PDF
    const blob = await pdf(
      <PDFRenderComponent record={data.find((item) => item.InvoiceID === invoiceID)} />
    ).toBlob();

    // Create form data
    const formData = new FormData();
    formData.append("file", blob, `Invoice_${invoiceNumber}.pdf`);

    // Send the PDF to the server
    try {
      const response = await axiosInstance.post(`/api/v1/saveInvoicePdf/${invoiceNumber}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("PDF saved successfully!", response.data);
      toast.success(`PDF enregistré avec succès ! Facture N° : ${invoiceNumber}`);

      // Once saved, trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error("Erreur lors de la génération du PDF.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/deleteInvoice/${deleteItemId}`);
      setData(data.filter((item) => item.InvoiceID !== deleteItemId));
      toast.success(`Facture supprimée avec succès ! ${response.data.invoiceNumber}`);
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un achat est associé à cet élément.");
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

  const filteredData = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (inv) =>
        String(inv.invoiceNumber || "").toLowerCase().includes(q) ||
        String(inv.customerName || "").toLowerCase().includes(q) ||
        String(inv.DescriptionProduct || "").toLowerCase().includes(q)
    );
  }, [data, quickFilter]);

  const columns = [
    {
      key: "invoiceNumber",
      header: "N° Facture",
      sortable: true,
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.invoiceNumber}</span>,
    },
    {
      key: "customerName",
      header: "Nom client",
      sortable: true,
      render: (r) => (
        <span className="block max-w-[220px] truncate font-medium" title={r.customerName}>
          {r.customerName}
        </span>
      ),
    },
    {
      key: "InvoiceDate",
      header: "Date facturation",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.InvoiceDate)}</span>,
    },
    {
      key: "dueDate",
      header: "Date échéance",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.dueDate)}</span>,
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
            {r.Status}
          </Badge>
        ) : null,
    },
    {
      key: "DescriptionProduct",
      header: "Produit",
      headerClassName: "text-center",
      className: "text-center",
      render: (r) => (r.DescriptionProduct ? <Badge variant="secondary">{r.DescriptionProduct}</Badge> : null),
    },
    {
      key: "TotalAmount",
      header: "Montant (TND)",
      sortable: true,
      sortValue: (r) => Number(r.TotalAmount),
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <span className="whitespace-nowrap font-semibold tabular-nums">{Number(r.TotalAmount).toFixed(3)}</span>
      ),
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
          <Button
            variant="ghost"
            size="icon-sm"
            title="Télécharger la facture"
            onClick={() => handleDownloadClick(r.InvoiceID, r.invoiceNumber)}
            className="text-muted-foreground hover:text-primary"
          >
            <Download />
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        icon={Receipt}
        title="Liste des factures"
        description="Consultez et téléchargez l'ensemble de vos factures."
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-base font-semibold">Toutes les factures</h2>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
          <Input
            icon={Search}
            placeholder="Rechercher une facture…"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            className="h-9 sm:w-72"
          />
        </div>
        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.InvoiceID}
          loading={loading}
          pageSize={20}
          pageSizeOptions={[20, 50, 100]}
          label="factures"
          emptyTitle="Aucune facture trouvée"
          emptyDescription="Modifiez votre recherche pour voir plus de résultats."
        />
      </Card>

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer cette facture ?"
        description="Cette action est définitive et ne peut pas être annulée."
      />
    </>
  );
};

export default Invoice_List;
