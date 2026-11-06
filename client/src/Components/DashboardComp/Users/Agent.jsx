import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Search, UserCheck, UserX, Users } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import PopupForm from "./PopupForm";
import { DataTable } from "@/Components/ui/data-table";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { ConfirmDialog } from "@/Components/ui/confirm-dialog";
import { RowActions } from "@/Components/ui/row-actions";
import { formatDate } from "@/lib/format";

const roleBadge = (role) => (role === "Owner" ? "success" : role === "Agent" ? "default" : "violet");

const Agent = () => {
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
      const response = await axiosInstance.get("/api/v1/getallusers");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (User_ID) => {
    try {
      const response = await axiosInstance.get(`/api/v1/getuserbyid/${User_ID}`);
      setUserData(response.data);
      setPopupOpen(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Impossible de charger l'agent.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/deleteuser/${deleteItemId}`);
      setData(data.filter((item) => item.User_ID !== deleteItemId));
      toast.success("Supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un achat est associé à cet utilisateur.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteModalVisible(true);
  };

  const handleActivation = async (userId, currentStatus) => {
    try {
      const res = await axiosInstance.post(`/api/v1/activateuser/${userId}`);
      if (res.status === 200) {
        toast.success(`Utilisateur ${currentStatus ? "désactivé" : "activé"} avec succès.`);
        fetchData();
      } else {
        toast.error("Échec du changement de statut de l'utilisateur.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors du changement de statut.");
      console.error("Error:", error);
    }
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
      (u) =>
        String(u.fullname || "").toLowerCase().includes(q) ||
        String(u.UserEmail || "").toLowerCase().includes(q) ||
        String(u.UserName || "").toLowerCase().includes(q) ||
        String(u.Role || "").toLowerCase().includes(q) ||
        String(u.User_ID || "").toLowerCase().includes(q)
    );
  }, [data, quickFilter]);

  const columns = [
    {
      key: "User_ID",
      header: "ID",
      sortable: true,
      sortValue: (r) => Number(r.User_ID),
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">#{r.User_ID}</span>,
    },
    {
      key: "fullname",
      header: "Agent",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {(r.fullname || "?").slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="m-0 truncate font-medium">{r.fullname}</p>
            {r.UserEmail && <p className="m-0 truncate text-xs text-muted-foreground">{r.UserEmail}</p>}
          </div>
        </div>
      ),
    },
    { key: "UserName", header: "Identifiant" },
    {
      key: "Role",
      header: "Rôle",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (r) => (r.Role ? <Badge variant={roleBadge(r.Role)}>{r.Role}</Badge> : null),
    },
    {
      key: "tag_actif",
      header: "Statut",
      headerClassName: "text-center",
      className: "text-center",
      render: (r) =>
        r.tag_actif ? (
          <Badge variant="success" dot>
            Actif
          </Badge>
        ) : (
          <Badge variant="destructive" dot>
            Inactif
          </Badge>
        ),
    },
    {
      key: "DateOfBirth",
      header: "Date de naissance",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.DateOfBirth)}</span>,
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
        <RowActions onEdit={() => handleEdit(r.User_ID)} onDelete={() => showDeleteModal(r.User_ID)}>
          <Button
            variant="ghost"
            size="icon-sm"
            title={r.tag_actif ? "Désactiver" : "Activer"}
            onClick={() => handleActivation(r.User_ID, r.tag_actif)}
            className="text-muted-foreground hover:text-primary"
          >
            {r.tag_actif ? <UserCheck /> : <UserX />}
          </Button>
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        icon={Users}
        title="Agents"
        description="Gérez les comptes utilisateurs et leurs rôles."
        actions={
          <Button onClick={() => setPopupOpen(true)}>
            <Plus /> Nouvel agent
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-base font-semibold">Tous les agents</h2>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
          <Input
            icon={Search}
            placeholder="Rechercher un agent…"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            className="h-9 sm:w-72"
          />
        </div>
        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.User_ID}
          loading={loading}
          pageSize={20}
          pageSizeOptions={[20, 50, 100]}
          label="agents"
          emptyTitle="Aucun agent trouvé"
          emptyDescription="Modifiez votre recherche pour voir plus de résultats."
        />
      </Card>

      {isPopupOpen && <PopupForm isOpen={isPopupOpen} onClose={handleClosePopup} userData={userData} />}

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer cet agent ?"
        description="Cette action est définitive et ne peut pas être annulée."
      />
    </>
  );
};

export default Agent;
