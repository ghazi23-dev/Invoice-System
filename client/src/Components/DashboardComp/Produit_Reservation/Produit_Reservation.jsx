import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../Auth/AxiosInstance";
import {
  faTrash,
  faEdit,
  faEye, 
 
} from "@fortawesome/free-solid-svg-icons";
import "ag-grid-community/styles/ag-theme-material.css";
import ProduitForm from "./ProduitForm";
import ProduitViewForm from "./ProduitViewForm";
import { Button, Space, Modal,Tag } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Produit_Reservation.css";

const Produit_Reservation = () => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupViewOpen, setPopupViewOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/getallProduit");
      console.log("Response from server:", response.data);

      // Ensure response data is an array
      const Produit = response.data.success ? response.data.Produits : [];
      setData(Produit);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from server:", error);
      setLoading(false);
    }
  };

  // const handleEdit = async (Agency_ID) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/v1/getagencybyid/${Agency_ID}`);
  //     const user = response.data;
  //     setUserData(user);
  //     console.log("User Data:", user);
  //     setPopupOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     toast.error("Failed to fetch user data.");
  //   }
  // };

  // const handleView = async (Agency_ID) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/v1/getagencybyid/${Agency_ID}`);
  //     const user = response.data;
  //     setUserData(user);
  //     console.log("User Data:", user);
  //     setPopupViewOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     toast.error("Failed to fetch user data.");
  //   }
  // };


  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/deleteProduit/${deleteItemId}`);
      console.log("Response from server:", response.data);
      setData(data.filter((item) => item.ProductID !== deleteItemId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un Achat associé a cet Utilisateurs.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (ProductID) => {
    setDeleteItemId(ProductID);
    setDeleteModalVisible(true);
  };

  const handleUpdate = () => {
    fetchData();
    console.log("Data Fetched From Api Table Updated");
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setUserData(null);
    handleUpdate();
  };



  const columns = [
    { headerName: "ID Produit", field: "ProductID" ,
    maxWidth: 140,
    cellRenderer: (params) => (
      <Tag color="black">{params.value}</Tag>
    ),
    
    },
    { headerName: "Désignation", 
    field: "Libelle",
    
    
  },
    { headerName: "Type Réservation", field: "Type",
    cellRenderer: (params) => {
      let tagColor;
      switch (params.value) {
        case 'Hotel':
          tagColor = 'green-inverse';
          break;
        case 'Billetterie':
          tagColor = 'orange-inverse';
          break;
          case 'Marine':
          tagColor = 'purple-inverse';
          break;
        case 'Préstation Service':
          tagColor = 'red-inverse';
          break;
         
        default:
          tagColor = 'default'; 
      }
    
      return <Tag color={tagColor}>{params.value}</Tag>;
    },
      
     },
    { headerName: "Date Création", field: "Created_at" },

 
    {
      headerName: "Action",
      field: "actions",
      maxWidth: 180,
      cellRenderer: (params) => (
        <Space size="middle">
          <Button
            style={{ color: "green", fontWeight: "bold" }}
            icon={<FontAwesomeIcon icon={faEdit} size="lg" />}
            onClick={() => handleEdit(params.data.Agency_ID)}
          ></Button>
          <Button
            style={{ color: "red", fontWeight: "bold" }}
            icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
            onClick={() => showDeleteModal(params.data.ProductID)}
          ></Button>
           <Button
            style={{ color: "BLACK", fontWeight: "bold" }}
            icon={<FontAwesomeIcon icon={faEye} size="lg" />}
            onClick={() => handleView(params.data.Agency_ID)}
          ></Button>
         
        </Space>
      ),
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 160,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    editable: false,
  };

  return (
    <>
      <h1>Liste Des Produits</h1>
      <div className="ag-theme-material" style={{ height: 700, width: '100%' }}>
        <Button
          className="Button"
          type="primary"
          onClick={() => setPopupOpen(true)}
          style={{ position: "absolute", top: "100px", right: "18px" }}
        >
          Insert
        </Button>
        <AgGridReact
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
        />
        {isPopupOpen && (
          <ProduitForm
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            userData={userData}
          />
        )}

        {isPopupViewOpen && (
          <ProduitViewForm
            isOpen={isPopupViewOpen}
            onClose={handleClosePopup}
            userData={userData}
          />
        )}

        <Modal
          title="Confirm Deletion"
          open={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      </div>
    </>
  );
};

export default Produit_Reservation;
