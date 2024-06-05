import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../Auth/AxiosInstance";

import "ag-grid-community/styles/ag-theme-material.css";
import { FilePdfFilled, DownloadOutlined } from "@ant-design/icons";
import { Button, Space, Modal, Tag } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PDFRenderComponent from "./Row_PDF_Reglement_Quittance";
import { PDFDownloadLink,PDFViewer } from "@react-pdf/renderer";

const Invoice_List = () => {
  const [data, setData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupViewOpen, setPopupViewOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/getInvoices");
      console.log("Response from server:", response.data);

      // Ensure response data is an array
      const invoices = response.data.success ? response.data.invoices : response.data;
      setData(invoices);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from server:", error);
      setLoading(false);
    }
  };


  const handleRowClick = (record) => {
    setSelectedRow(record.data.InvoiceID); // Updated to access the correct data
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/deleteuser/${deleteItemId}`);
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

  const columns = [
    { 
      headerName: "Invoice ID", 
      field: "InvoiceID",
      cellRenderer: (params) => (
        <Tag color="orange-inverse">{params.value}</Tag>
      ),
    },
    { 
      headerName: "Invoice Number", 
      field: "invoiceNumber",
      cellRenderer: (params) => (
        <Tag color="blue-inverse">{params.value}</Tag>
      ),
    },
    { 
      headerName: "Customer Name", 
      field: "customerName" 
    },
    { 
      headerName: "Invoice Date", 
      field: "InvoiceDate",
      cellRenderer: (params) => (
        <Tag color="green-inverse">{new Date(params.value).toLocaleDateString()}</Tag>
      ),
    },
    { 
      headerName: "Due Date", 
      field: "dueDate",
      cellRenderer: (params) => (
        <Tag color="red-inverse">{new Date(params.value).toLocaleDateString()}</Tag>
      ),
    },
    { 
      headerName: "Status", 
      field: "Status",
      cellRenderer: (params) => (
        <Tag color={params.value === "Paid" ? "green-inverse" : "red-inverse"}>{params.value}</Tag>
      ),
    },
    { 
      headerName: "Reference Number", 
      field: "referenceNumber" 
    },
    { 
      headerName: "Description Product", 
      field: "DescriptionProduct" 
    },
    { 
      headerName: "Total HT", 
      field: "TotalHT" 
    },
    { 
      headerName: "Discount", 
      field: "Discount" 
    },
    { 
      headerName: "TVA", 
      field: "Tva" 
    },
    { 
      headerName: "Timbre Fiscal", 
      field: "Timbre_Fiscal" 
    },
    { 
      headerName: "Total Amount", 
      field: "TotalAmount" 
    },
    { 
      headerName: "Created At", 
      field: "CreatedAt",
      cellRenderer: (params) => (
        <Tag color="purple-inverse">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    { 
      headerName: "Updated At", 
      field: "UpdatedAt",
      cellRenderer: (params) => (
        <Tag color="yellow-inverse">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    {
      headerName: "Action",
      field: "actions",
      cellRenderer: (params) => (
        <Space size="middle">
          {selectedRow === params.data.InvoiceID ? (
            <PDFDownloadLink
              document={<PDFRenderComponent record={params.data} />}
              fileName={`Quittance_${params.data.InvoiceID}.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  <Button loading icon={<FilePdfFilled />}></Button>
                ) : (
                  <Button icon={<FilePdfFilled />}></Button>
                )
              }
            </PDFDownloadLink>
          ) : (
            <Button onClick={() => handleRowClick(params)}> {/* Click to select row */}
              <DownloadOutlined />
            </Button>
          )}
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
      <h1>Liste Des Facture</h1>
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
          onRowClicked={(record) => handleRowClick(record)} // Updated to use onRowClicked
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
        />

<div style={{ width: "100%", marginLeft: "20px" }}>
          {selectedRow && (
            <PDFViewer style={{ width: "100%", height: 900 }}>
              <PDFRenderComponent record={data.find(item => item.InvoiceID === selectedRow)} />
            </PDFViewer>
          )}
        </div>
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

export default Invoice_List;
