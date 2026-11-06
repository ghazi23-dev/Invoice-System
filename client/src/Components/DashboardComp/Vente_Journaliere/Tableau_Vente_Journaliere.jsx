import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Banknote, HandCoins, Hourglass, Plus, ReceiptText, Save, Search, TrendingUp } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { DataGrid } from "@/Components/ui/data-grid";
import { StatCard } from "@/Components/ui/stat-card";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { formatDT, formatAmount } from "@/lib/format";

const REGLEMENT_VARIANT = {
  ESPECE: "success",
  CHEQUE: "warning",
  CREDIT: "violet",
  VIREMENT: "destructive",
  VERSEMENT: "default",
};

const amountFormatter = (p) => formatAmount(p.value);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [quickFilter, setQuickFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [statistics, setStatistics] = useState({
    totalVentes: 0,
    totalAvance: 0,
    totalReste: 0,
    nombreTransactions: 0,
  });

  useEffect(() => {
    fetchData();
    handleupdate();
    calculateStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const calculateStatistics = () => {
    const stats = data.reduce(
      (acc, curr) => ({
        totalVentes: acc.totalVentes + Number(curr.PRIX_VENTE || 0),
        totalAvance: acc.totalAvance + Number(curr.AVANCE || 0),
        totalReste: acc.totalReste + Number(curr.RESTE || 0),
        nombreTransactions: acc.nombreTransactions + 1,
      }),
      { totalVentes: 0, totalAvance: 0, totalReste: 0, nombreTransactions: 0 }
    );
    setStatistics(stats);
  };

  const formatDate = (dateString) => (dateString ? dateString.split("T")[0] : dateString);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/getallAchatReservations");
      if (Array.isArray(response.data?.achatReservations)) {
        const formattedData = response.data.achatReservations.map((row) => ({
          ...row,
          DATE: formatDate(row.DATE),
          DATE_ENTREE: formatDate(row.DATE_ENTREE),
        }));
        setData(formattedData);
      } else {
        console.error("achatReservations is not an array:", response.data?.achatReservations);
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  };

  const addNewRow = () => {
    setData([
      ...data,
      {
        DATE: "",
        AGENT: "",
        DESIGNATION: "",
        PLATEFORME: "",
        "NOM CLIENT": "",
        "CONTACT CLIENT": "",
        "DATE ENTREE": "",
        REGLEMENT: "",
        "N° RECU": "",
        "PRIX VENTE": "0",
        "PRIX ACHAT": "0",
        AVANCE: "0",
        RESTE: "0",
        OBSERVATION: "",
        isNew: true,
      },
    ]);
  };

  const updateRow = async (row) => {
    try {
      await axiosInstance.put(`/api/v1/updateAchatReservation/${row.AchatID}`, row);
      toast.success("Transaction mise à jour avec succès !");
    } catch (error) {
      console.error("Error updating row:", error);
      handleupdate();
    }
  };

  const handleCellValueChanged = ({ data, oldValue, newValue }) => {
    if (data.isNew) return; // new rows are saved with "Enregistrer"
    if (oldValue !== newValue) {
      updateRow(data);
      calculateStatistics();
    }
  };

  const [columnDefs] = useState([
    {
      headerName: "N°",
      field: "AchatID",
      filter: "agNumberColumnFilter",
      editable: false,
      maxWidth: 110,
      minWidth: 90,
      pinned: "left",
      cellRenderer: (p) =>
        p.value != null ? (
          <span className="font-mono text-xs font-semibold text-primary">#{p.value}</span>
        ) : (
          <Badge variant="accent">Nouveau</Badge>
        ),
    },
    { headerName: "Date", field: "DATE", filter: "agDateColumnFilter", editable: true },
    { headerName: "Agent", field: "AGENT", filter: "agTextColumnFilter", editable: true, maxWidth: 150 },
    {
      headerName: "Désignation",
      field: "DESIGNATION",
      filter: "agTextColumnFilter",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Reservation Hotel", "Billet Avion", "Billet Batteux"] },
    },
    { headerName: "Plateforme", field: "PLATEFORME", filter: "agTextColumnFilter", editable: true },
    {
      headerName: "Client",
      field: "NOM_CLIENT",
      filter: "agTextColumnFilter",
      editable: true,
      cellClass: "font-medium",
    },
    { headerName: "Contact", field: "CONTACT_CLIENT", filter: "agTextColumnFilter", editable: true },
    { headerName: "Date entrée", field: "DATE_ENTREE", filter: "agDateColumnFilter", editable: true },
    {
      headerName: "Règlement",
      field: "REGLEMENT",
      filter: "agTextColumnFilter",
      editable: true,
      cellRenderer: (p) =>
        p.value ? (
          <Badge variant={REGLEMENT_VARIANT[p.value] || "secondary"}>{p.value}</Badge>
        ) : null,
    },
    { headerName: "N° reçu", field: "NUMERO_RECU", filter: "agNumberColumnFilter", editable: true, minWidth: 135 },
    {
      headerName: "Prix vente",
      field: "PRIX_VENTE",
      filter: "agNumberColumnFilter",
      editable: true,
      type: "rightAligned",
      cellClass: "tabular-nums font-medium justify-end",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Prix achat",
      field: "PRIX_ACHAT",
      filter: "agNumberColumnFilter",
      editable: true,
      type: "rightAligned",
      cellClass: "tabular-nums justify-end",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Avance",
      field: "AVANCE",
      filter: "agNumberColumnFilter",
      editable: true,
      type: "rightAligned",
      cellClass: "tabular-nums justify-end font-medium text-success",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Reste",
      field: "RESTE",
      filter: "agNumberColumnFilter",
      editable: true,
      type: "rightAligned",
      cellClass: (p) =>
        "tabular-nums justify-end " + (Number(p.value) > 0 ? "font-semibold text-destructive" : "text-muted-foreground"),
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Observation",
      field: "OBSERVATION",
      filter: "agTextColumnFilter",
      editable: true,
      minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["OK", "EN ATTENTE DE PAIEMENT"] },
      cellRenderer: (p) =>
        p.value === "OK" ? (
          <Badge variant="success" dot>
            Réglé
          </Badge>
        ) : p.value === "EN ATTENTE DE PAIEMENT" ? (
          <Badge variant="warning" dot>
            En attente de paiement
          </Badge>
        ) : (
          p.value || null
        ),
    },
  ]);

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    editable: true,
  };

  const handleupdate = async () => {
    fetchData();
  };

  const saveChanges = async () => {
    const newRows = data.filter((row) => row.isNew);
    setSaving(true);
    try {
      for (const row of newRows) {
        await axiosInstance.post("/api/v1/createAchatReservation", row);
      }
      const updatedRowData = data.map((row) => ({ ...row, isNew: false }));
      setData(updatedRowData);
      calculateStatistics();
      toast.success("Transactions enregistrées avec succès !");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Veuillez remplir tous les champs obligatoires.");
      handleupdate();
    } finally {
      setSaving(false);
    }
  };

  const pending = data.filter((r) => r.isNew).length;
  const collectedPct = statistics.totalVentes ? Math.round((statistics.totalAvance / statistics.totalVentes) * 100) : 0;

  return (
    <div>
      <PageHeader
        icon={TrendingUp}
        title="Ventes journalières"
        description="Suivez vos ventes, avances et restes à encaisser."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total ventes" value={formatDT(statistics.totalVentes)} icon={Banknote} tone="primary" />
        <StatCard
          label="Total avances"
          value={formatDT(statistics.totalAvance)}
          icon={HandCoins}
          tone="success"
          hint={`${collectedPct}% du chiffre d'affaires encaissé`}
        />
        <StatCard label="Reste à encaisser" value={formatDT(statistics.totalReste)} icon={Hourglass} tone="destructive" />
        <StatCard label="Transactions" value={statistics.nombreTransactions} icon={ReceiptText} tone="accent" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-base font-semibold">Transactions</h2>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              icon={Search}
              placeholder="Rechercher…"
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              className="h-9 sm:w-64"
            />
            <Button variant="outline" size="sm" className="h-9" onClick={addNewRow}>
              <Plus /> Nouvelle ligne
            </Button>
            <Button size="sm" className="h-9" onClick={saveChanges} loading={saving} disabled={!pending}>
              <Save /> Enregistrer
              {pending > 0 && (
                <span className="rounded-full bg-white/25 px-1.5 text-[11px] font-semibold">{pending}</span>
              )}
            </Button>
          </div>
        </div>
        <DataGrid
          className="[&_.ag-root-wrapper]:rounded-none [&_.ag-root-wrapper]:border-0 [&_.ag-root-wrapper]:shadow-none"
          height={640}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[20, 50, 100]}
          onCellValueChanged={handleCellValueChanged}
          stopEditingWhenCellsLoseFocus
          getRowClass={(params) => (params.data.isNew ? "new-row" : "")}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
