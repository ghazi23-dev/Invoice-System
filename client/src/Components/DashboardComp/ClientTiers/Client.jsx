import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../Auth/AxiosInstance";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import "ag-grid-community/styles/ag-theme-material.css";
import ClientForm from "./ClientForm";
import { Button, Space, Modal, Tag } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Client = () => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
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
      const response = await axiosInstance.get("/api/V1/getAllClients");
      console.log("Response from server:", response.data);
      const clients = response.data.success ? response.data.clients : [];
      setData(clients);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  };

  const handleEdit = async (Client_ID) => {
    try {
      const response = await axiosInstance.get(
        `/api/V1/getClientByID/${Client_ID}`
      );
      const user = response.data;
      setUserData(user);
      console.log("User Data:", user);
      setPopupOpen(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/deleteuser/${deleteItemId}`
      );
      console.log("Response from server:", response.data);
      setData(data.filter((item) => item.User_ID !== deleteItemId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting data from server:", error);
      toast.warn("Un Achat associé a cet Utilisateurs.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const showDeleteModal = (id) => {
    setDeleteItemId(id);
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
    { headerName: "Code Client", field: "Client_ID" ,
    cellRenderer: (params) => (
      <Tag color="blue-inverse">{params.value}</Tag>
    ),
    minWidth: 80,
    },
    { headerName: "Nom Client", field: "ClientName",
    cellRenderer: (params) => (
      <Tag color="purple-inverse">{params.value}</Tag>
    ),
     },
    { headerName: "Numéro Tel", field: "ClientPhone" },
    { headerName: "Email", field: "ClientEmail" },
    { headerName: "Adresse", field: "ClientAddress" },
    { headerName: "Régions", field: "ClientLocation" ,
      maxWidth: 140,
    },
    { headerName: "Matricule Fiscale", field: "Matricule_fiscale",
cellRenderer: (params) => (
          <Tag color="blue-inverse">{params.value}</Tag>
                ),
                maxWidth: 200,


    },
    
   
    { headerName: "Date de Création", field: "created_at" 
    ,cellRenderer: (params) => (
      <Tag color="green-inverse">{new Date(params.value).toLocaleString()}</Tag>
    ),
    minWidth: 200,

    },
    {
      headerName: "Action",
      field: "actions", // Make sure this matches the field in your data source
      cellRenderer: (params) => (
        <Space size="middle">
          <Button
            style={{ color: "green", fontWeight: "bold" }}
            icon={<FontAwesomeIcon icon={faEdit} size="lg" />}
            onClick={() => handleEdit(params.data.Client_ID)}
          ></Button>
          <Button
            style={{ color: "red", fontWeight: "bold" }}
            icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
            onClick={() => showDeleteModal(params.data.User_ID)}
          ></Button>
        </Space>
      ),
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 190,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    editable: false,
  };
  return (
    <>
      <h1>Liste Des Clients</h1>
      <div className="ag-theme-material" style={{ height: 700, width: "100%" }}>
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
          <ClientForm
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            userData={userData}
          />
        )}

        {/* Delete Confirmation Modal */}
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

export default Client;
