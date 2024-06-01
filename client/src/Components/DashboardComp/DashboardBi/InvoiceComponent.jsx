import { useState, useEffect } from "react";
import "./InvoiceComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AxiosInstance from "../../../Auth/AxiosInstance"

const InvoiceComponent = () => {
  const [products, setProducts] = useState([{ name: "", quantity: 0, rate: 0 }]);
  const [ReservationProducts, setReservationProducts] = useState([]);

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    customerName: "",
    invoiceDate: "",
    dueDate: "",
    status: "",
    referenceNumber: "",
    product: "",
    quantity: 0,
    rate: 120,
    discountType: "Percentage(%)",
    discountValue: 0,
    tax: "",
    bank: "",
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
  

  const handleSave = () => {
    // Save logic
  };

  const handleSend = () => {
    // Send logic
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { name: "", quantity: 0, rate: 0, tax: 0, newColumn1: '', newColumn2: '' }, // Add new columns here
  
    ]);
    
  };

  const calculateAmounts = () => {
          // Calculate the taxable amount without tax
          const taxableAmount = products.reduce((acc, product) => {
            const amount = product.quantity * product.rate;
            return acc + amount;
          }, 0);
        
          // Calculate total discount
          let totalDiscount;
          if (invoice.discountType === "Percentage(%)") {
            totalDiscount = (taxableAmount * invoice.discountValue) / 100;
          } else {
            totalDiscount = invoice.discountValue;
          }
        
          // Calculate the discounted amount
          const totalDiscountedAmount = taxableAmount - totalDiscount;
        
          // Calculate the total tax amount
          const totalTaxAmount = products.reduce((acc, product) => {
            if (product.tax) {
              const taxAmount = product.quantity * product.rate * (product.tax / 100);
              return acc + taxAmount;
            }
            return acc;
          }, 0);
        
          // Calculate the total amount (taxable amount + tax amount)
          const totalAmount = totalDiscountedAmount + totalTaxAmount;
        
          return {
            taxableAmount: taxableAmount.toFixed(3),
            discount: parseFloat(totalDiscount).toFixed(3),
            tva: totalTaxAmount.toFixed(3),
            totalAmount: totalAmount.toFixed(3),
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
  
    // Automatically set tax and product name based on the selected product
    if (name === "product") {
      const selectedProduct = ReservationProducts.find(product => product.ProductID === parseInt(value));
      if (selectedProduct) {
        newProducts[index].tax = selectedProduct.Tva;
        newProducts[index].name = selectedProduct.Libelle;
      }
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
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
    });
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
                  <th>TVA Achat</th>
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
                  />
                </td>{" "}
                {/* Tax field */}
                <td>
                  {product.tax
                    ? (
                        product.quantity *
                        product.rate *
                        (1 + product.tax / 100)
                      ).toFixed(2)
                    : (product.quantity * product.rate).toFixed(2)}
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
        <QRCode value={`Invoice Number: ${invoice.invoiceNumber}, Total Amount: ${calculateAmounts().totalAmount}`} />
      </div>
    </div>
  );
};

export default InvoiceComponent;
