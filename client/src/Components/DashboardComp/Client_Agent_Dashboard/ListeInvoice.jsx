import { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Stack, IconButton, AppBar, Toolbar } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { CreditCard, AccountBalance, CalendarToday, AccessTime } from '@mui/icons-material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import InvoiceViewForm from "../DashboardBi/InvoiceViewComponent";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Tag, Space, message,Modal } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload,faEye,faTrash, faFileInvoiceDollar} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PDFRenderComponent from "../DashboardBi/Row_PDF_Reglement_Quittance";
import {  pdf } from "@react-pdf/renderer";
import './listeinvoice.css'

const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [selectedInvoiceID, setSelectedInvoiceID] = useState(null); // State to track selected invoice ID
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  
    try {
      setLoading(true);
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
    
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/deleteInvoice/${deleteItemId}`);
      console.log("Response from server:", response.data);
      setData(data.filter((item) => item.InvoiceID !== deleteItemId));
      message.success(`Invoice deleted successfully! ${response.data.invoiceNumber} `);
    } catch (error) {
      console.error("Error deleting data from server:", error);
      message.warn("Server Error.");
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
      navigate(`/Dashboard/ListeFactures/${InvoiceID}`); // Navigate to the new route
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };



  const handleDownloadClick = async (invoiceID, invoiceNumber) => {
    setDownloadInvoiceID(invoiceID);
    
    // Generate the PDF
    const blob = await pdf(<PDFRenderComponent record={data.find(item => item.InvoiceID === invoiceID)} />).toBlob();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', blob, `Invoice_${invoiceNumber}.pdf`);
    
    // Send the PDF to the server
    try {
      // const response = await axiosInstance.post(`/api/v1/saveInvoicePdf/${invoiceNumber}`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // console.log('PDF saved successfully!', response.data);
      // message.success(`PDF saved successfully! Invoice number: ${invoiceNumber}`);
      
      // Once saved, trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success(`PDF saved successfully! Invoice number: ${invoiceNumber}`);
    } catch (error) {
      console.error('Error saving PDF:', error);
    }
  };

  const HandleNavigation = () => {
    navigate("/Dashboard/DashboardBi");
  };

  // Add these calculations before the summaryCards definition
  const calculateStatistics = () => {
    if (!data || data.length === 0) return {
      paidInvoices: "0.000",
      overdueAmount: "0.000",
      avgPaymentDays: "0",
      lastYearAmount: "0.000",
      lastYearPercentage: "0"
    };

    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Calculate paid invoices total
    const paidInvoices = data
      .filter(invoice => invoice.Status === "Paid")
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    // Calculate overdue amount
    const overdueAmount = data
      .filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        return invoice.Status !== "Paid" && dueDate < currentDate;
      })
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    // Calculate average payment days
    const paidInvoicesWithDates = data.filter(invoice => invoice.Status === "Paid");
    const avgDays = paidInvoicesWithDates.length > 0
      ? paidInvoicesWithDates.reduce((sum, invoice) => {
          const dueDate = new Date(invoice.dueDate);
          const invoiceDate = new Date(invoice.InvoiceDate);
          return sum + Math.ceil((dueDate - invoiceDate) / (1000 * 60 * 60 * 24));
        }, 0) / paidInvoicesWithDates.length
      : 0;

    // Calculate last year's amount and percentage change
    const lastYearTotal = data
      .filter(invoice => new Date(invoice.InvoiceDate) >= oneYearAgo)
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    const previousYearTotal = data
      .filter(invoice => {
        const invoiceDate = new Date(invoice.InvoiceDate);
        const twoYearsAgo = new Date(oneYearAgo);
        twoYearsAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return invoiceDate >= twoYearsAgo && invoiceDate < oneYearAgo;
      })
      .reduce((sum, invoice) => sum + Number(invoice.TotalAmount), 0);

    const percentageChange = previousYearTotal !== 0
      ? ((lastYearTotal - previousYearTotal) / previousYearTotal * 100)
      : 0;

    return {
      paidInvoices: paidInvoices.toFixed(3),
      overdueAmount: overdueAmount.toFixed(3),
      avgPaymentDays: Math.round(avgDays),
      lastYearAmount: lastYearTotal.toFixed(3),
      lastYearPercentage: percentageChange.toFixed(1)
    };
  };

  const stats = calculateStatistics();

  const summaryCards = [
    {
      title: "Factures Payées",
      value: stats.paidInvoices,
      currency: "TND",
      bgColor: "#f06292",
      textColor: "white",
      borderColor: "#e0e0e0",
      icon: <CreditCard sx={{ color: 'white' }} />
    },
    {
      title: "En Retard",
      value: stats.overdueAmount,
      currency: "TND",
      bgColor: "#ffffff",
      borderColor: "#e0e0e0",
      icon: <AccountBalance sx={{ color: '#1976d2' }} />
    },
    {
      title: "Moy. De Réglement",
      value: stats.avgPaymentDays,
      suffix: "Journée(s)",
      bgColor: "#4caf50",
      textColor: "white",
      icon: <CalendarToday sx={{ color: 'white' }} />
    },
    {
      title: "Une Année En Arriére",
      value: stats.lastYearAmount,
      currency: "TND",
      suffix: `(${stats.lastYearPercentage}%)`,
      bgColor: "#fdd835",
      textColor: "white",
      icon: <AccessTime sx={{ color: 'white' }} />
    },
  ];

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 80,
    },
    { 
      field: 'invoiceNumber', 
      headerName: 'N°Facture', 
      minWidth: 160,
      cellRenderer: (params) => (
        <span style={{  backgroundColor: 'black',color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px'   }}>{params.value}</span>
      )
    },
    { field: 'customerName', headerName: 'Nom Client',
      minWidth: 180,
    
     },
    { 
      field: 'Status', 
      headerName: 'Statut',
      cellRenderer: (params) => (
        <Tag color={params.value === "Paid" ? "green-inverse" : "red-inverse"}>{params.value}</Tag>

      ),
      minWidth: 130,
     
    },
    { field: 'InvoiceDate', headerName: 'Date Facturation',
      cellRenderer: (params) => (
        <Tag color="geekblue-inverse">
         {(params.value).split('T')[0]}
        </Tag>
      ),
      minWidth: 180,
    
     },
    { field: 'dueDate', headerName: 'Date Echéance',
      cellRenderer: (params) => (
        <Tag color="volcano-inverse">
         {(params.value).split('T')[0]}
        </Tag>
     ),
    },
    

    { 
      headerName: "Produit", 
      field: "DescriptionProduct",
      maxWidth: 130,
      cellRenderer: (params) => (
        <Tag color="black">
          {params.value}
        </Tag>
     ),
    },
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
      headerName: "Créé le", 
      field: "CreatedAt",
      minWidth: 160,
      cellRenderer: (params) => (
        <Tag color="purple-inverse">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    { 
      headerName: "Mise à jour", 
      field: "UpdatedAt",
      minWidth: 160,
      cellRenderer: (params) => (
        <Tag color="#008997">{new Date(params.value).toLocaleString()}</Tag>
      ),
    },
    {
      headerName: "Action",
      field: "actions",
      maxWidth: 190,
      minWidth: 190,
      cellRenderer: (params) => (
        <Space size="small">
          <IconButton
            color="primary"
            onClick={() => {
              handleDownloadClick(params.data.InvoiceID, params.data.invoiceNumber);
            }}
          >
            <FontAwesomeIcon icon={faDownload} size="sm" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setDeleteModalVisible(true);
              setDeleteItemId(params.data.InvoiceID);
            }}
          >
            <FontAwesomeIcon icon={faTrash} size="sm" />
          </IconButton>
          <IconButton
            color='success'
            onClick={() => viewInvoice1(params.data.InvoiceID)}
          >
            <FontAwesomeIcon icon={faEye} size="sm" />
          </IconButton>
        </Space>
      ),
    },
  ];



  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    floatingFilter: true,
    
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onQuickFilterChanged = (event) => {
    gridApi.setQuickFilter(event.target.value);
  };

  const HandleNewInvoice = () => {
    setShowNewInvoiceForm(true);
  };

  return (
    <Box sx={{ p: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        
        <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: 10 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
            Liste Des Factures
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#fdd835', '&:hover': { bgcolor: '#fbc02d' } }}
            >
              ACTION
            </Button>
            <Button 
              variant="contained" 
              sx={{ bgcolor: '#f5f5f5', color: 'black', '&:hover': { bgcolor: '#e0e0e0' } }}
            >
              IMPORTER
            </Button>
            <Button 
onClick={HandleNavigation}
              variant="contained" 
              sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
            >
              NOUVELLE FACTURE
            </Button>
          
          </Stack>
        </Toolbar>
      </AppBar>
      <br />
         
         
        </Box>
      </Box>

      {/* Summary Cards */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
      >
        {summaryCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              p: 2,
              bgcolor: card.bgColor,
              color: card.textColor,
              border: card.borderColor ? `1px solid ${card.borderColor}` : 'none',
              boxShadow: card.borderColor ? 1 : 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              {card.icon}
              <Typography variant="h6" component="div">
                {card.value} {card.currency} {card.suffix}
              </Typography>
            </Box>
            <Typography variant="body2">
              {card.title}
            </Typography>
          </Card>
        ))}
      </Stack>

      {/* AG Grid */}
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#fdd835', '&:hover': { bgcolor: '#fbc02d' } }}
          >
            AFFICHAGE DES COLONNES
          </Button>
          <input
            type="text"
            onChange={onQuickFilterChanged}
            placeholder="Recherche avancée..."
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '200px'
            }}
          />
        </Box>
        <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
        
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            enableCellTextSelection={true}
            suppressRowClickSelection={true}
            loading={loading}
            
           
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
      </Card>
    </Box>
  );
};

export default App;