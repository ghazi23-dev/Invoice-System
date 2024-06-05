import { useState, useEffect } from "react";
import "./InvoiceComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import QRCode from 'qrcode.react';

import AxiosInstance from "../../../Auth/AxiosInstance"
import html2pdf from 'html2pdf.js';

const InvoiceComponent = () => {
  const [products, setProducts] = useState([{ name: "", quantity: 0, rate: 0 }]);
  const [ReservationProducts, setReservationProducts] = useState([]);

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    customerName: "Ghazi",
    invoiceDate: "",
    dueDate: "",
    status: "Paid",
    referenceNumber: "",
    product: "",
    quantity: "",
    rate: "",
    discountType: "Percentage(%)",
    discountValue: 0,
    tax: "",
    notes: "",
    terms: "",
    signatureName: "",
    signatureImage: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get('/api/v1/getallProduit');
        if (response.data.success) {
          setReservationProducts(response.data.Produits);
          console.log('Products fetched successfully', response.data.Produits);
         
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        
      }
    };

    fetchProducts();
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => {
      const updatedInvoice = { ...prevInvoice, [name]: value };
  
      if (name === "product") {
        const selectedProduct = ReservationProducts.find(product => product.ProductID === parseInt(value));
        if (selectedProduct) {
          updatedInvoice.tax = selectedProduct.Tva;
        }
      }console.log("Selected Product:", value);
  
      return updatedInvoice;
    });
  
    // Update tax and product name for the selected product in the products array
    if (name === "product") {
      const selectedProduct = ReservationProducts.find(product => product.ProductID === parseInt(value));
      if (selectedProduct) {
        const updatedProducts = products.map((product, index) => {
          if (index >=0) { 
            return { ...product, tax: selectedProduct.Tva, name: selectedProduct.Libelle };
          }
          return product;
        });
        setProducts(updatedProducts);
      }
    }
  };
  

  const handleSave = async () => {
    // Convert invoice date and due date to ISO-8601 format
    const formattedInvoiceDate = new Date(invoice.invoiceDate).toISOString();
    const formattedDueDate = new Date(invoice.dueDate).toISOString();

    // Format the items
    const formattedItems = products.map(product => ({
        ProductID: parseInt(invoice.product), 
        Description: product.name,
        Quantity: parseInt(product.quantity), 
        DiscountType: invoice.discountType,
        DiscountValue: parseFloat(invoice.discountValue),
        Tax: product.tax.toString(),
        TotalTTC: parseFloat((product.quantity * product.rate * (1 + product.tax / 100)).toFixed(3)),
        Notes: invoice.notes,
        Terms: invoice.terms,
        SignatureName: invoice.signatureName,
        Discount: parseFloat(invoice.discountValue),
        Rate: parseFloat(product.rate),
        Amount: parseFloat((product.quantity * product.rate).toFixed(3)),
        Montant_Achat: parseFloat(product.newColumn1),
        Montant_Debourser: parseFloat(product.newColumn2)
    }));

    // Create invoice data object
    const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        InvoiceDate: formattedInvoiceDate, // Use formatted date
        dueDate: formattedDueDate, // Use formatted date
        Status: invoice.status,
        referenceNumber: invoice.referenceNumber,
        DescriptionProduct: ReservationProducts.find(p => p.ProductID === parseInt(invoice.product))?.Type || '', // Use the product type
        TotalHT: parseFloat(calculateAmounts().taxableAmount), // Convert to float
        Discount: parseFloat(calculateAmounts().discount), // Convert to float
        Tva: parseFloat(calculateAmounts().tva), // Convert to float
        Timbre_Fiscal: parseFloat(calculateAmounts().totalTimbreFiscale), // Convert to float
        TotalAmount: parseFloat(calculateAmounts().totalAmount).toFixed(3), // Convert to float
        Items: formattedItems
    };

    console.log("Invoice data being sent to the server:", invoiceData);

    try {
        const response = await AxiosInstance.post('/api/v1/createInvoice', invoiceData);
        console.log("Server response:", response);

        if (response.data.success) {
            console.log('Invoice created successfully', response.data);
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Config:', error.config);
    }
};




  const handleSend = async () => {
    await handleSave();
    // Additional logic to send the invoice (e.g., via email) can be added here.
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { name: "", quantity: 0, rate: 0, tax: 0,  newColumn1: '', newColumn2: '' }, // Add new columns here
  
    ]);
    
  };
  const calculateAmounts = () => {
    let taxableAmount = 0;
    let totalTaxAmount = 0;
    let totalDiscount = 0;
    let totalAmount = 0;
    
    const totalTimbreFiscale = 1;
  
    products.forEach((product) => {
      let productTaxableAmount = 0;
      let productTaxAmount = 0;
      let productTotalAmount = 0;
  
      if (invoice.product === "2") {
        // Custom calculation for Billetterie
        const newColumn2 = product.rate - product.newColumn1;
        productTaxableAmount = newColumn2 / (1 + product.tax / 100);
        productTaxAmount = productTaxableAmount * (product.tax / 100);
        productTotalAmount = parseFloat(product.rate)*parseFloat(product.quantity) ;
      } else {
        // Default calculation for other products
        productTaxableAmount = product.quantity * product.rate;
        productTaxAmount = product.quantity * product.rate * (product.tax / 100);
        productTotalAmount = product.quantity * product.rate * (1 + product.tax / 100);
      }
  
      taxableAmount += productTaxableAmount;
      totalTaxAmount += productTaxAmount;
      totalAmount += productTotalAmount;
    });
  
    // Ensure discount value is treated as a number
    const discountValue = parseFloat(invoice.discountValue) || 0;
  
    // Calculate total discount
    if (invoice.discountType === "Percentage(%)") {
      totalDiscount = (taxableAmount * discountValue) / 100;
    } else {
      totalDiscount = discountValue;
    }
  
    totalAmount += totalTimbreFiscale - totalDiscount;
  
    return {
      taxableAmount: taxableAmount.toFixed(3),
      discount: totalDiscount.toFixed(3),
      tva: totalTaxAmount.toFixed(3),
      totalAmount: totalAmount.toFixed(3),
      totalTimbreFiscale: totalTimbreFiscale.toFixed(3),
    };
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: files[0],
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;
  
    if (name === "product") {
      const selectedProduct = ReservationProducts.find(product => product.ProductID === parseInt(value));
      if (selectedProduct) {
        newProducts[index].tax = selectedProduct.Tva;
        newProducts[index].name = selectedProduct.Libelle;
      }
    }
  
    if (name === "rate" || name === "newColumn1") {
      newProducts[index].newColumn2 = newProducts[index].rate * newProducts[index].quantity - newProducts[index].newColumn1;
    }
  
    setProducts(newProducts);
  };
  

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('invoice-form');
    const options = {
      margin: 0.5,
      filename: `invoice_${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(input).set(options).save();
  };
  return (
    <div className="invoice-form" id="invoice-form">
      <h1>Add Invoice</h1>
      <div className="form-row">
        <div className="form-group">
          <label>Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={invoice.invoiceNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Customer Name</label>
          <select
            name="customerName"
            value={invoice.customerName}
            onChange={handleChange}
          >
            <option value="">Choose Customer</option>
            {/* Add customer options here */}
          </select>
        </div>
        <div className="form-group">
          <label>Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={invoice.invoiceDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={invoice.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={invoice.status} onChange={handleChange}>
            <option value="">Choose Status</option>
            {/* Add status options here */}
          </select>
        </div>
        <div className="form-group">
          <label>Reference Number</label>
          <input
            type="text"
            name="referenceNumber"
            value={invoice.referenceNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
      <label>Products</label>
      <select
        name="product"
        value={invoice.product}
        onChange={handleChange}
      >
        <option value="">Select Product</option>
        {ReservationProducts.map((ReservationProducts, index) => (
            <option key={index} value={ReservationProducts.ProductID}>
              {ReservationProducts.Type}
            </option>
          ))}
      </select>
    </div>
      </div>
      <div className="product-section">
        <table>
          <thead>
            <tr>
              <th>Product / Service</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>P.U</th>
              {invoice.product === "2" && (
                <>
                  <th>Achat</th>
                  <th>Débourser</th>
                </>
              )}
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    size={40}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                <td>Pcs</td>
                <td>
                  <input
                    type="number"
                    name="rate"
                    value={product.rate}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                {invoice.product === "2" && (
                  <>
                    <td>
                      <input
                        type="number"
                        name="newColumn1"
                        value={product.newColumn1}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="newColumn2"
                        value={product.newColumn2}
                        onChange={(e) => handleProductChange(index, e)}
                        disabled
                      />
                    </td>
                  </>
                )}
  

                <td>
                  <input
                    type="number"
                    name="tax"
                    value={product.tax}
                    onChange={(e) => handleProductChange(index, e)}
                    disabled
                  />
                </td>{" "}
                {/* Tax field */}
                <td>
                  {product.tax
                    ? (
                        product.quantity *
                        product.rate *
                        (1 + product.tax / 100)
                      ).toFixed(3)
                    : (product.quantity * product.rate).toFixed(3)}
                </td>
                <td>
                  <Button
                    type="button"
                    icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
                    onClick={() => handleDeleteProduct(index)}
                  ></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          style={{ marginTop: "10px" }}
          type="primary"
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </div>
      <div className="discount-section">
        <div className="form-group">
          <label>Discount Type</label>
          <select
            name="discountType"
            value={invoice.discountType}
            onChange={handleChange}
          >
            <option value="Percentage(%)">Percentage(%)</option>
            <option value="Flat">Flat</option>
          </select>
        </div>
        <div className="form-group">
          <label>Discount</label>
          <input
            type="number"
            name="discountValue"
            value={invoice.discountValue}
            onChange={handleChange}
          />
        </div>
        {/* <div className="form-group">
          <label>Tax</label>
          <select name="tax" value={invoice.tax} onChange={handleChange}>
            <option value="">Choose Tax</option>
            
          </select>
        </div> */}
      </div>
      {/* <div className="bank-section">
        <div className="form-group">
          <label>Select Bank</label>
          <select name="bank" value={invoice.bank} onChange={handleChange}>
            <option value="">Select Bank</option>
           
          </select>
        </div>
        <button type="button" className="add-bank">
          Add Bank
        </button>
      </div> */}
      <div className="notes-section">
        <div className="form-group">
          <label>Notes</label>
          <textarea style={{ resize: "none" }}     
                 name="notes"
            value={invoice.notes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="terms-section">
        <div className="form-group">
          <label>Terms and Conditions</label>
          <textarea style={{ resize: "none" }}
            name="terms"
            value={invoice.terms}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="signature-section">
        <div className="form-group">
          <label>Signature Name</label>
          <input style={{ fontFamily: 'Brittany Signature', fontStyle: 'italic'}}
            type="text"
            name="signatureName"
            value={invoice.signatureName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Signature Image</label>
          <input
            type="file"
            name="signatureImage"
            onChange={handleFileChange}
          />
        </div>
       
      </div>
      <div className="total-section">
        <p>Total HT:  {calculateAmounts().taxableAmount}</p>
        <p>Discount: {calculateAmounts().discount}</p>
        <p>TVA: {calculateAmounts().tva}</p>
        <p>Timbre Fiscale: {calculateAmounts().totalTimbreFiscale}</p>
        <p>Total Amount: {calculateAmounts().totalAmount}</p>
      </div>
      <div className="buttons-section">
        <button type="button" className="btn btn-save" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="btn btn-send" onClick={handleSend}>
          Save & Send
        </button>
        <button type="button" className="btn btn-download" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
      <div className="qr-code-section">
        <QRCode value={`STE KAYAN VOYAGES  Facture N°: ${invoice.invoiceNumber}, Total Amount: ${calculateAmounts().totalAmount}`} />
      </div>
    </div>
  );
};

export default InvoiceComponent;
