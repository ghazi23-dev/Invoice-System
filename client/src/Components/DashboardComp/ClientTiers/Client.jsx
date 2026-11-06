import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Search, Users } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import ClientForm from "./ClientForm";
import { DataTable } from "@/Components/ui/data-table";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { ConfirmDialog } from "@/Components/ui/confirm-dialog";
import { RowActions } from "@/Components/ui/row-actions";
import { formatDate } from "@/lib/format";

const Client = () => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/V1/getAllClients");
      const clients = response.data.success ? response.data.clients : [];
      setData(clients);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (Client_ID) => {
    try {
      const response = await axiosInstance.get(`/api/V1/getClientByID/${Client_ID}`);
      setUserData(response.data);
      setPopupOpen(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Impossible de charger le client.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/deleteuser/${deleteItemId}`);
      setData(data.filter((item) => item.User_ID !== deleteItemId));
      toast.success("Supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un achat est associé à cet élément.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteModalVisible(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setUserData(null);
    fetchData();
  };

  const filteredData = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) =>
        String(c.ClientName || "").toLowerCase().includes(q) ||
        String(c.ClientEmail || "").toLowerCase().includes(q) ||
        String(c.ClientPhone || "").toLowerCase().includes(q) ||
        String(c.ClientAddress || "").toLowerCase().includes(q) ||
        String(c.ClientLocation || "").toLowerCase().includes(q) ||
        String(c.Matricule_fiscale || "").toLowerCase().includes(q) ||
        String(c.Client_ID || "").toLowerCase().includes(q)
    );
  }, [data, quickFilter]);

  const columns = [
    {
      key: "Client_ID",
      header: "Code",
      sortable: true,
      sortValue: (r) => Number(r.Client_ID),
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">#{r.Client_ID}</span>,
    },
    {
      key: "ClientName",
      header: "Client",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {(r.ClientName || "?").slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="m-0 truncate font-medium">{r.ClientName}</p>
            {r.ClientEmail && <p className="m-0 truncate text-xs text-muted-foreground">{r.ClientEmail}</p>}
          </div>
        </div>
      ),
    },
    { key: "ClientPhone", header: "Téléphone", render: (r) => <span className="whitespace-nowrap">{r.ClientPhone}</span> },
    {
      key: "ClientAddress",
      header: "Adresse",
      render: (r) => <span className="block max-w-[260px] truncate text-muted-foreground">{r.ClientAddress}</span>,
    },
    {
      key: "ClientLocation",
      header: "Région",
      render: (r) => (r.ClientLocation ? <Badge variant="secondary">{r.ClientLocation}</Badge> : null),
    },
    {
      key: "Matricule_fiscale",
      header: "Matricule fiscal",
      render: (r) => <span className="font-mono text-xs">{r.Matricule_fiscale}</span>,
    },
    {
      key: "created_at",
      header: "Créé le",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.created_at)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => (
        <RowActions onEdit={() => handleEdit(r.Client_ID)} onDelete={() => showDeleteModal(r.User_ID)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        icon={Users}
        title="Clients"
        description="Gérez votre portefeuille clients et leurs informations fiscales."
        actions={
          <Button onClick={() => setPopupOpen(true)}>
            <Plus /> Nouveau client
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-base font-semibold">Tous les clients</h2>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
          <Input
            icon={Search}
            placeholder="Rechercher un client…"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            className="h-9 sm:w-72"
          />
        </div>
        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.Client_ID}
          loading={loading}
          pageSize={20}
          pageSizeOptions={[20, 50, 100]}
          label="clients"
          emptyTitle="Aucun client trouvé"
          emptyDescription="Modifiez votre recherche pour voir plus de résultats."
        />
      </Card>

      {isPopupOpen && <ClientForm isOpen={isPopupOpen} onClose={handleClosePopup} userData={userData} />}

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer ce client ?"
        description="Cette action est définitive et ne peut pas être annulée."
      />
    </>
  );
};

export default Client;
