import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Auth/AxiosInstance';
import './InvoiceViewComponent.css';

const InvoiceViewComponent = () => {
  const { InvoiceID } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/getInvoiceByID/${InvoiceID}`);
        const invoice = response.data.success ? response.data.invoice : response.data;
        setInvoiceData(invoice);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [InvoiceID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!invoiceData) {
    return <p>No invoice data available</p>;
  }
  
  return (
          <div className="invoice-view-container">
            <h1 className="invoice-view-title">Invoice View</h1>
            <div className="invoice-view-header">
              <div className="invoice-view-details">
                <div className="invoice-view-form-row">
                  <label>Invoice Number</label>
                  <input type="text" value={invoiceData.invoiceNumber} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Customer Name</label>
                  <input type="text" value={invoiceData.customerName} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Invoice Date</label>
                  <input type="text" value={new Date(invoiceData.InvoiceDate).toLocaleDateString()} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Due Date</label>
                  <input type="text" value={new Date(invoiceData.dueDate).toLocaleDateString()} readOnly />
                </div>
              </div>
              <div className="invoice-view-status">
                <div className="invoice-view-form-row">
                  <label>Status</label>
                  <input type="text" value={invoiceData.Status} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Description</label>
                  <input type="text" value={invoiceData.DescriptionProduct} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Total Amount</label>
                  <input type="text" value={invoiceData.TotalAmount} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Timbre Fiscal</label>
                  <input type="text" value={invoiceData.Timbre_Fiscal} readOnly />
                </div>
                <div className="invoice-view-form-row">
                  <label>Notes</label>
                  <textarea value={invoiceData.Notes} readOnly />
                </div>
              </div>
            </div>
            <h3>Invoice Items</h3>
            <table className="invoice-view-items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.Items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Description}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.Rate}</td>
                    <td>{item.Amount}</td>
                    <td>{item.Tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-sections">
        <p>Total HT: {invoiceData.TotalHT} </p>
        <p>Discount: {invoiceData.Discount} </p>
        <p>TVA: {invoiceData.Tva}</p>
        <p>Timbre Fiscale:{invoiceData.Timbre_Fiscal} </p>
        <p>Total Amount: {invoiceData.TotalAmount}</p>
      </div>
          </div>
        );
      };
      
      export default InvoiceViewComponent;