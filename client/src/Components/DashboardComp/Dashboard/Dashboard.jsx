import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "ag-grid-community/styles/ag-theme-material.css";
import { Tag } from "antd";
import {Button} from 'antd';
import axiosInstance from "../../../Auth/AxiosInstance"
import './Dashboard.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faSave,

faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
const Dashboard = () => {
  const [data, setData] = useState([]);
 
  useEffect(() => {
    fetchData();
    handleupdate ();
  }, []);
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
      'PRIX VENTE': '',
      'PRIX ACHAT': '',
      AVANCE: '',
      RESTE: '',
      OBSERVATION: '',
      isNew: true
    }]);
  };

  const updateRow = async (row) => {
    try {
      await axiosInstance.put(`/api/v1/updateAchatReservation/${row.AchatID}`, row);
      console.log('Row updated successfully');
      toast.success('Transaction Mise à jour avec succès!');
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
      cellStyle: {backgroundColor: '#52C41A'},
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
      toast.success('Transaction Ajoutée avec succès!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Remplire tous les champs obligatoires svp..');
      handleupdate();
    }
  };
  
  
  return (
    <div className="ag-theme-material" style={{ height: 700, width: '100%' }}>
      <h1>Dashboard</h1>
      <Button 
        icon={<FontAwesomeIcon icon={faPlusCircle} size="lg" />}
      style={{position:"absolute", right:"0" ,marginRight: '9%', marginBottom: '10px', top:"110px",}}
      variant="contained" type='primary'  onClick={addNewRow}>
      
      </Button>
      <Button 
      icon={<FontAwesomeIcon icon={faSave} size="lg" />}
      style={{ position:"absolute", right:"10px" , marginBottom: '10px', top:"110px",}}
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
  );
}

export default Dashboard;
