import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Card, Row, Col, Statistic,message } from 'antd';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-community/styles/ag-theme-material.css";
import { Tag } from "antd";
import { Button } from 'antd';
import axiosInstance from "../../../Auth/AxiosInstance"
import './Tableau_Vente_Journaliere.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faPlusCircle,
  faMoneyBill,
  faHandHoldingDollar,
  faCoins,
  faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState({
    totalVentes: 0,
    totalAvance: 0,
    totalReste: 0,
    nombreTransactions: 0
  });

  useEffect(() => {
    fetchData();
    handleupdate();
    calculateStatistics();

  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [data]);

  const calculateStatistics = () => {
    const stats = data.reduce((acc, curr) => ({
      totalVentes: acc.totalVentes + Number(curr.PRIX_VENTE || 0),
      totalAvance: acc.totalAvance + Number(curr.AVANCE || 0),
      totalReste: acc.totalReste + Number(curr.RESTE || 0),
      nombreTransactions: acc.nombreTransactions + 1
    }), {
      totalVentes: 0,
      totalAvance: 0,
      totalReste: 0,
      nombreTransactions: 0
    });
    setStatistics(stats);
   
  };

  const formatDate = (dateString) => {
    return dateString.split('T')[0]; // Extract only the date part
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/getallAchatReservations");
      console.log("Response from server Achat Reservation:", response.data);
      // Check if achatReservations is an array
      if (Array.isArray(response.data?.achatReservations)) {
        // Format the dates
        const formattedData = response.data.achatReservations.map(row => ({
          ...row,
          DATE: formatDate(row.DATE),
          DATE_ENTREE: formatDate(row.DATE_ENTREE),
        }));
        setData(formattedData); // Set the formatted data
      } else {
        console.error("achatReservations is not an array:", response.data?.achatReservations);
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  };

  const addNewRow = () => {
    setData([...data, {
      DATE: '',
      AGENT: '',
      DESIGNATION: '',
      PLATEFORME: '',
      'NOM CLIENT': '',
      'CONTACT CLIENT': '',
      'DATE ENTREE': '',
      REGLEMENT: '',
      'N° RECU': '',
      'PRIX VENTE': '0',
      'PRIX ACHAT': '0',
      AVANCE: '0',
      RESTE: '0',
      OBSERVATION: '',
      isNew: true
    }]);
  };

  const updateRow = async (row) => {
    try {
      await axiosInstance.put(`/api/v1/updateAchatReservation/${row.AchatID}`, row);
      console.log('Row updated successfully');
      message.success('Transaction Mise à jour avec succès!');
    } catch (error) {
      console.error('Error updating row:', error);
      handleupdate();
    }
  };

  const handleCellValueChanged = ({ data, oldValue, newValue }) => {
    if (data.isNew) {
      // Skip updating the row if it is a new row
      return;
    }
    if (oldValue !== newValue) {
      updateRow(data);
    }
  };

  const [columnDefs] = useState([
    { headerName: 'N° Ligne', field: 'AchatID', filter: 'agNumberColumnFilter', editable: false,
    cellRenderer: (params) => (
      <Tag color="blue-inverse">{params.value}</Tag>
    ),
    maxWidth: 130,
    },
    { headerName: 'DATE', field: 'DATE', filter: 'agDateColumnFilter', editable: true },
    { headerName: 'AGENT', field: 'AGENT', filter: 'agTextColumnFilter', editable: true,
    maxWidth: 135,
     },
    { headerName: 'DESIGNATION', field: 'DESIGNATION', filter: 'agTextColumnFilter', editable: true },
    { headerName: 'PLATEFORME', field: 'PLATEFORME', filter: 'agTextColumnFilter', editable: true ,},
    { headerName: 'NOM CLIENT', field: 'NOM_CLIENT', filter: 'agTextColumnFilter', editable: true },
    { headerName: 'CONTACT CLIENT', field: 'CONTACT_CLIENT', filter: 'agTextColumnFilter', editable: true },
    { headerName: 'DATE ENTREE', field: 'DATE_ENTREE', filter: 'agDateColumnFilter', editable: true },
    { 
      headerName: 'REGLEMENT', 
      field: 'REGLEMENT', 
      filter: 'agTextColumnFilter',
      editable: true,
      


      cellRenderer: (params) => {
        let tagColor;
        switch (params.value) {
          case 'ESPECE':
            tagColor = 'green-inverse';
            break;
          case 'CHEQUE':
            tagColor = 'orange-inverse';
            break;
            case 'CREDIT':
            tagColor = 'purple-inverse';
            break;
          case 'VIREMENT':
            tagColor = 'red-inverse';
            break;
            case 'VERSEMENT':
              tagColor = 'blue-inverse';
              break;
          default:
            tagColor = 'default'; // Set a default color if needed
        }
      
        return <Tag color={tagColor}>{params.value}</Tag>;
      },
      // cellClassRules: {
      //   'paid-cell': params => params.value === 'Paid',
      //   'not-paid-cell': params => params.value === 'Not Paid',
      //   'canceled-cell': params => params.value === 'Canceled',
      // }
    },
    { headerName: 'N° RECU', field: 'NUMERO_RECU', filter: 'agNumberColumnFilter', editable: true,
    maxWidth: 135,

     },
    { headerName: 'PRIX VENTE', field: 'PRIX_VENTE', filter: 'agNumberColumnFilter', editable: true,
    valueFormatter: (params) => parseFloat(params.value).toFixed(3),
     },
    { headerName: 'PRIX ACHAT', field: 'PRIX_ACHAT', filter: 'agNumberColumnFilter', editable: true,
    valueFormatter: (params) => parseFloat(params.value).toFixed(3),
     },
    { 
      headerName: 'AVANCE', 
      field: 'AVANCE', 
      filter: 'agNumberColumnFilter', 
      editable: true,
      cellStyle: {backgroundColor: '#86D65E'},
      valueFormatter: (params) => parseFloat(params.value).toFixed(3),
  },
  
    { headerName: 'RESTE', field: 'RESTE', filter: 'agNumberColumnFilter', editable: true ,
    cellStyle: {backgroundColor: 'red',},
    valueFormatter: (params) => parseFloat(params.value).toFixed(3),

    },
    { headerName: 'OBSERVATION', field: 'OBSERVATION', filter: 'agTextColumnFilter', editable: true },
  ]);

  const defaultColDef = {
    flex: 1,
    minWidth: 170,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    editable: true,


  

  };

const handleupdate = async () => {
  fetchData();
  console.log("Api Updated")
}

  const saveChanges = async () => {
    // Filter out the new rows
    const newRows = data.filter(row => row.isNew);
  
    try {
      // Send a POST request for each new row
      
      for (const row of newRows) {
        await axiosInstance.post('/api/v1/createAchatReservation', row);
      }
  
      // Update isNew to false after saving
      const updatedRowData = data.map(row => ({ ...row, isNew: false }));
      setData(updatedRowData);
  
      console.log('Changes saved successfully');
      message.success('Transaction Enregistrer & Ajoutée avec succès!');
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Remplire tous les champs obligatoires svp..');
      handleupdate();
    }
  };
  
  
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px' }}>Vente Journalière</h1>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card sales-card">
            <Statistic
              title="Total Ventes"
              value={statistics.totalVentes.toFixed(3)}
              prefix={<FontAwesomeIcon icon={faMoneyBill} />}
              suffix="DT"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card advance-card">
            <Statistic
              title="Total Avances"
              value={statistics.totalAvance.toFixed(3)}
              prefix={<FontAwesomeIcon icon={faHandHoldingDollar} />}
              suffix="DT"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card remaining-card">
            <Statistic
              title="Total Reste"
              value={statistics.totalReste.toFixed(3)}
              prefix={<FontAwesomeIcon icon={faCoins} />}
              suffix="DT"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card transactions-card">
            <Statistic
              title="Nombre de Transactions"
              value={statistics.nombreTransactions}
              prefix={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
            />
          </Card>
        </Col>
      </Row>

      <div className="ag-theme-material" style={{ height: 700, width: '100%' }}>
        <Button 
          icon={<FontAwesomeIcon icon={faPlusCircle} size="lg" />}
          style={{position:"absolute", right:"0" ,marginRight: '9%', marginBottom: '10px', top:"110px"}}
          variant="contained" 
          type='primary'  
          onClick={addNewRow}>
        </Button>
        <Button 
          icon={<FontAwesomeIcon icon={faSave} size="lg" />}
          style={{ position:"absolute", right:"10px" , marginBottom: '10px', top:"110px"}}
          onClick={saveChanges} >
          Save Changes
        </Button>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          onCellValueChanged={handleCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          getRowClass={params => params.data.isNew ? 'new-row' : ''}
        />
      </div>
    </div>
  );
}

export default Dashboard;
