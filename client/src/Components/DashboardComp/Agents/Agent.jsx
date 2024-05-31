import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../Auth/AxiosInstance";
import {
  faTrash,
  faEdit, 
  faUser,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import "ag-grid-community/styles/ag-theme-material.css";
import PopupForm from "./PopupForm";
import { Button,Space, Modal,Tag } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Agent.css"
const Agent = () => {
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

      const response = await axiosInstance.get(
        "/api/v1/getallusers",
      
      );
      console.log("Response from server:", response.data);
      setData(response.data);
     
        setLoading(false);
   
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  };

  const handleEdit = async (User_ID) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/getuserbyid/${User_ID}`
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

  const handleActivation = async (userId, currentStatus) => {
    try {
      const res = await axiosInstance.post(
        `/api/v1/activateuser/${userId}`
      );

      // Check if the request was successful
      if (res.status === 200) {
        toast.success(
          `User ${currentStatus ? "desactivated" : "activated"} successfully.`
        );
        fetchData();
      } else {
        toast.error("Failed to toggle user activation status.");
      }
    } catch (error) {
      toast.error("An error occurred while toggling user activation status.");
      console.error("Error:", error);
    }
  };

  const columns = [
    { headerName: "User_ID", field: "User_ID" },
    { headerName: "UserName", field: "UserName" },
    { headerName: "fullname", field: "fullname" },
    { headerName: "Email", field: "UserEmail" },
    { 
      headerName: "Role", 
      field: "Role",
      cellRenderer: (params) => (
        <Tag color={params.value === "Owner" ? "green-inverse" : params.value === "Agent" ? "blue-inverse" : "orange-inverse"}>
          {params.value}
        </Tag>
      ),
      
    },
    { headerName: "Date de Naissance", field: "DateOfBirth" },
    { headerName: "Date de Création", field: "created_at" },
    {
      headerName: "Action",
      field: "actions", // Make sure this matches the field in your data source
      cellRenderer: (params) => (
        <Space size="middle" >
         
          <Button
           style={{color:"green",fontWeight:"bold"}}
            icon={<FontAwesomeIcon icon={faEdit} size="lg" />}
            onClick={() => handleEdit(params.data.User_ID)}
            
          ></Button>
           <Button
           style={{color:"red",fontWeight:"bold"}}
            icon={<FontAwesomeIcon icon={faTrash} size="lg"/>}
            onClick={() => showDeleteModal(params.data.User_ID)}
          ></Button>
          <Button
           style={{color:"",fontWeight:"bold"}}
            onClick={() => handleActivation(params.data.User_ID, params.data.tag_actif)}
          >
            {params.data.tag_actif ? (
              <FontAwesomeIcon icon={faUser} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faUserSlash} size="lg" />
            )}
          </Button>
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
      <h1>Liste Des Agents</h1>
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
          <PopupForm
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

export default Agent;
