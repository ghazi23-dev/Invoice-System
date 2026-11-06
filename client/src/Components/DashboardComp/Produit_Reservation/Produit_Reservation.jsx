import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Boxes, Plus, Search } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import ProduitForm from "./ProduitForm";
import { DataTable } from "@/Components/ui/data-table";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { ConfirmDialog } from "@/Components/ui/confirm-dialog";
import { RowActions } from "@/Components/ui/row-actions";
import { formatDate } from "@/lib/format";

const typeBadge = {
  Hotel: "success",
  Billetterie: "warning",
  Marine: "violet",
  "Préstation Service": "destructive",
};

const Produit_Reservation = () => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
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
      const response = await axiosInstance.get("/api/v1/getallProduit");
      // Ensure response data is an array
      const Produit = response.data.success ? response.data.Produits : [];
      setData(Produit);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/v1/deleteProduit/${deleteItemId}`);
      setData(data.filter((item) => item.ProductID !== deleteItemId));
      toast.success("Supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un achat est associé à cet élément.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (ProductID) => {
    setDeleteItemId(ProductID);
    setDeleteModalVisible(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    fetchData();
  };

  const filteredData = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (p) =>
        String(p.Libelle || "").toLowerCase().includes(q) ||
        String(p.Type || "").toLowerCase().includes(q) ||
        String(p.ProductID || "").toLowerCase().includes(q)
    );
  }, [data, quickFilter]);

  const columns = [
    {
      key: "ProductID",
      header: "ID Produit",
      sortable: true,
      sortValue: (r) => Number(r.ProductID),
      render: (r) => <span className="font-mono text-xs font-semibold text-primary">#{r.ProductID}</span>,
    },
    {
      key: "Libelle",
      header: "Désignation",
      sortable: true,
      render: (r) => <span className="font-medium">{r.Libelle}</span>,
    },
    {
      key: "Type",
      header: "Type de réservation",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (r) => (r.Type ? <Badge variant={typeBadge[r.Type] || "secondary"}>{r.Type}</Badge> : null),
    },
    {
      key: "Tva",
      header: "TVA",
      headerClassName: "text-center",
      className: "text-center",
      render: (r) =>
        r.Tva !== null && r.Tva !== undefined && r.Tva !== "" ? (
          <Badge variant="default">{Number(r.Tva).toFixed(3)} %</Badge>
        ) : null,
    },
    {
      key: "Created_at",
      header: "Date de création",
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-muted-foreground">{formatDate(r.Created_at)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (r) => <RowActions onDelete={() => showDeleteModal(r.ProductID)} />,
    },
  ];

  return (
    <>
      <PageHeader
        icon={Boxes}
        title="Produits de réservation"
        description="Catalogue des hôtels, billetteries, traversées marines et services."
        actions={
          <Button onClick={() => setPopupOpen(true)}>
            <Plus /> Nouveau produit
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-base font-semibold">Tous les produits</h2>
            <Badge variant="secondary">{data.length}</Badge>
          </div>
          <Input
            icon={Search}
            placeholder="Rechercher un produit…"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            className="h-9 sm:w-72"
          />
        </div>
        <DataTable
          columns={columns}
          rows={filteredData}
          getRowId={(r) => r.ProductID}
          loading={loading}
          pageSize={20}
          pageSizeOptions={[20, 50, 100]}
          label="produits"
          emptyTitle="Aucun produit trouvé"
          emptyDescription="Modifiez votre recherche pour voir plus de résultats."
        />
      </Card>

      {isPopupOpen && <ProduitForm isOpen={isPopupOpen} onClose={handleClosePopup} />}

      <ConfirmDialog
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Supprimer ce produit ?"
        description="Cette action est définitive et ne peut pas être annulée."
      />
    </>
  );
};

export default Produit_Reservation;
