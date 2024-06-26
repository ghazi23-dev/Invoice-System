import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../Auth/AxiosInstance";
import "ag-grid-community/styles/ag-theme-material.css";
import { FilePdfFilled,  } from "@ant-design/icons";
import { Button, Space, Modal, Tag } from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PDFRenderComponent from "./Row_PDF_Reglement_Quittance";
import { PDFDownloadLink,  } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload,faEye,} from "@fortawesome/free-solid-svg-icons";
import InvoiceViewForm from "./InvoiceViewComponent";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Invoice_List = () => {
  const [data, setData] = useState([]);


  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedInvoiceID, setSelectedInvoiceID] = useState(null); // State to track selected invoice ID
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/getInvoices");
      console.log("Response from server:", response.data);
  
      const invoices = response.data.success ? response.data.invoices : response.data;
      // Format the dueDate properly
      const formattedInvoices = invoices.map(invoice => ({
        ...invoice,
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        InvoiceDate: new Date(invoice.InvoiceDate).toISOString().split('T')[0],
       
      }));
      setData(formattedInvoices);
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from server:", error);
      setLoading(false);
    }
  };
  
  const handleDownloadClick = async (invoiceID) => {
    setDownloadInvoiceID(invoiceID);


    
  };
 

  // const handleRowClick = (record) => {
  //   setSelectedRow(record.data.InvoiceID); // Updated to access the correct data
  // };

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




  const viewInvoice1 = async (InvoiceID) => {
    try {
      const response = await axiosInstance.get(`/api/v1/getInvoiceByID/${InvoiceID}`);
      console.log("Invoice Getted By ID:", response.data);
      const invoice = response.data.success ? response.data.invoice : response.data;
      setInvoiceData(invoice);
      console.log("Invoice Data:", invoice);
      navigate(`/Dashboard/ListeFacture/${InvoiceID}`); // Navigate to the new route
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };


 

  const columns = [
    // { 
    //   headerName: "N° Ligne", 
    //   field: "InvoiceID",
    //   cellRenderer: (params) => (
    //     <Tag color="orange-inverse">{params.value}</Tag>
    //   ),
    //   maxWidth: 130,
    // },
    { 
      headerName: "N° Facture", 
      field: "invoiceNumber",
      cellRenderer: (params) => (
        <Tag color="blue-inverse">{params.value}</Tag>
      ),
     
    },
    { 
      headerName: "Nom Client", 
      field: "customerName" ,
      minWidth: 190,


    },
    { 
      headerName: "Date Facturation", 
      field: "InvoiceDate",
      filter: 'agDateColumnFilter',
      cellRenderer: (params) => (
        <Tag color="green-inverse">
         {(params.value).split('T')[0]}
        </Tag>
      ),
      width: 190,

    },
    {
      headerName: "Date Echéance", 
      field: "dueDate",
      minWidth: 180,
      filter: 'agDateColumnFilter',
      cellRenderer: (params) => (
        <Tag color="blue-inverse">
        {new Date(params.value).toISOString().split('T')[0]}
      </Tag>
      ),
      

   
    },
    
    
    { 
      headerName: "Status", 
      field: "Status",
      cellRenderer: (params) => (
        <Tag color={params.value === "Paid" ? "green-inverse" : "red-inverse"}>{params.value}</Tag>
      ),
      maxWidth: 120,
    },
    // { 
    //   headerName: "Reference Number", 
    //   field: "referenceNumber" 
    // },
    { 
      headerName: "Produit", 
      field: "DescriptionProduct",
      maxWidth: 130,
    },
    // { 
    //   headerName: "Total HT", 
    //   field: "TotalHT", 
    //   maxWidth: 150,
    // },
    // { 
    //   headerName: "Discount", 
    //   field: "Discount" 
    // },
    // { 
    //   headerName: "TVA", 
    //   field: "Tva" 
    // },
    // { 
    //   headerName: "Timbre Fiscal", 
    //   field: "Timbre_Fiscal" 
    // },
    { 
      headerName: "Montant Total", 
      field: "TotalAmount", 
      minWidth: 180,
      cellRenderer: (params) => (
        
        
        <Tag color="red-inverse">
          {Number(params.value).toFixed(3)}
        </Tag>
      ),
    },
    { 
      headerName: "Created At", 
      field: "CreatedAt",
      minWidth: 160,
      cellRenderer: (params) => (
        <Tag color="purple-inverse">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    { 
      headerName: "Updated At", 
      field: "UpdatedAt",
      minWidth: 160,
      cellRenderer: (params) => (
        <Tag color="#008997">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    {
      headerName: "Action",
      field: "actions",
    
      cellRenderer: (params) => (
        <Space size="middle">
        {downloadInvoiceID === params.data.InvoiceID ? (
          <PDFDownloadLink
            document={<PDFRenderComponent record={params.data} />}
            fileName={`Facture N°${params.data.invoiceNumber}.pdf`}
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
          <Button
            style={{ color: 'black', fontWeight: 'bold' }}
            icon={<FontAwesomeIcon icon={faDownload} size="lg" />}
            onClick={() => {
              handleDownloadClick(params.data.InvoiceID);
              
            }}
          />
        )}
        <Button
          style={{ color: 'black', fontWeight: 'bold' }}
          icon={<FontAwesomeIcon icon={faEye} size="lg" />}
          onClick={() => viewInvoice1(params.data.InvoiceID)}
        />
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
      <h1>Liste Des Facture</h1>
      <div className="ag-theme-material" style={{ height: 700, width: '100%' }}>
        <Button
          className="Button"
          type="primary"
          
          style={{ position: "absolute", top: "100px", right: "18px" }}
        >
          Insert
        </Button>

     
        <AgGridReact
       // Updated to use onRowClicked
          rowData={data}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
        />




               {invoiceData && (
          <div>
            <InvoiceViewForm invoiceData={invoiceData} />
            <button onClick={() => setSelectedInvoiceID(null)}>Close Invoice</button>
          </div>
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

export default Invoice_List;
