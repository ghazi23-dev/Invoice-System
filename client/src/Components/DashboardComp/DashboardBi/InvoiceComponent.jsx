import { useState, useEffect } from "react";
import "./InvoiceComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Select, Input,Tooltip,message  } from "antd";
import QRCode from "qrcode.react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AxiosInstance from "../../../Auth/AxiosInstance";
import "./InvoiceComponent.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import PDFRenderComponent from "./Row_PDF_Reglement_Quittance";
import {  pdf } from "@react-pdf/renderer";
import axiosInstance from "../../../Auth/AxiosInstance";
const validationSchema = Yup.object().shape({
  //invoiceNumber: Yup.string().required("Invoice number is required"),
  customerName: Yup.string().required("Customer name is required"),
  invoiceDate: Yup.date().required("Invoice date is required"),
  dueDate: Yup.date().required("Due date is required"),
  status: Yup.string().required("Status is required"),
  product: Yup.string().required("Product is required"),
  discountValue: Yup.number().min(0, "Discount cannot be negative"),
  signatureName: Yup.string().required("Signature name is required"),
});

const { Option } = Select;

const InvoiceComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    { name: "", quantity: 0, rate: 0 },
  ]);
  const [ReservationProducts, setReservationProducts] = useState([]);
  const [Clients, setClients] = useState([]);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);

  const [invoice, setInvoice] = useState({
    invoiceNumber: ``,
    customerName: null,
    invoiceDate: "",
    dueDate: "",
    status: "",
    referenceNumber: "",
    Client_ID: "",
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

  const initialInvoiceState = {
    invoiceNumber: "",
    customerName: "",
    invoiceDate: "",
    dueDate: "",
    status: "",
    referenceNumber: "",
    Client_ID: "",
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
  };

  const formik = useFormik({
    initialValues: {
      invoiceNumber: "",
      customerName: null,
      invoiceDate: "",
      dueDate: "",
      status: "",
      referenceNumber: "",
      Client_ID: "",
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
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form data:", values);
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/api/v1/getallProduit");
        if (response.data.success) {
          setReservationProducts(response.data.Produits);
          console.log("Products fetched successfully", response.data.Produits);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleInvoiceNumberFetch = async () => {
    try {
      const response = await AxiosInstance.get("/api/v1/getLastInvoiceNumber");
  
      // Assuming the response is a string, update the invoice's invoiceNumber field
      setInvoice((prevInvoice) => ({
        ...prevInvoice,
        invoiceNumber: response.data, // Update invoiceNumber in the invoice state
      }));
    } catch (error) {
      console.error("Error fetching last invoice number:", error);
    }
  };
  
  

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await AxiosInstance.get("/api/V1/getAllClients");
        if (response.data.success) {
          setClients(response.data.clients);
          console.log("Clients fetched successfully", response.data.clients);
          console.log("Clients fetched id", response.data.clients[0].Client_ID);
        } else {
          console.error("Failed to fetch Clients");
        }
      } catch (error) {
        console.error("Error fetching Clients:", error);
      }
    };

    fetchClients();
    handleInvoiceNumberFetch();
  }, []);

  const handleChange = (eventOrName, value) => {
    formik.handleChange(eventOrName);

    let name;
    if (typeof eventOrName === "object" && eventOrName.target) {
      const event = eventOrName;
      name = event.target.name;
      value = event.target.value;
    } else {
      name = eventOrName;
    }

    formik.setFieldValue(name, value);

    setInvoice((prevInvoice) => {
      const updatedInvoice = { ...prevInvoice, [name]: value };

      if (name === "customerName") {
        const selectedClient = Clients.find(
          (client) => client.ClientName === value
        );
        if (selectedClient) {
          updatedInvoice.Client_ID = selectedClient.Client_ID;
        }
      }

      if (name === "product") {
        const selectedProduct = ReservationProducts.find(
          (product) => product.ProductID === parseInt(value)
        );
        if (selectedProduct) {
          updatedInvoice.tax = selectedProduct.Tva;
          if (selectedProduct.Type === "Hotel") {
            updatedInvoice.referenceNumber = `RSH-${Date.now() / Date.now()}`;
          } else if (selectedProduct.Type === "Billetterie") {
            updatedInvoice.referenceNumber = `BTT-${Date.now() / Date.now()}`;
          } else if (selectedProduct.Type === "Marine") {
            updatedInvoice.referenceNumber = `MRS-${Date.now() / Date.now()}`;
          } else if (selectedProduct.Type === "Préstation Service") {
            updatedInvoice.referenceNumber = `PRS-${Date.now() / Date.now()}`;
          }
        }
      }

      return updatedInvoice;
    });

    if (name === "product") {
      const selectedProduct = ReservationProducts.find(
        (product) => product.ProductID === parseInt(value)
      );
      if (selectedProduct) {
        const updatedProducts = products.map((product, index) => {
          if (index >= 0) {
            return {
              ...product,
              tax: selectedProduct.Tva,
              name: selectedProduct.Libelle,
            };
          }
          return product;
        });
        setProducts(updatedProducts);
      }
    }
  };


  const handleDownloadClickSaveInvoice = async (invoiceID, invoiceNumber, invoiceData) => {
    setDownloadInvoiceID(invoiceID);
  
    // Show loading message and keep the message open until you close it manually
    const hideLoadingMessage = message.loading('Generating PDF, please wait...', 0);
  
    try {
      // Generate the PDF, using invoiceData instead of data
      const blob = await pdf(<PDFRenderComponent record={invoiceData} />).toBlob();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, `Invoice_${invoiceNumber}.pdf`);
  
      // Send the PDF to the server
      const response = await axiosInstance.post(`/api/v1/saveInvoicePdf/${invoiceNumber}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('PDF saved successfully!', response.data);
  
      // Close the loading message once PDF generation and server saving is complete
      hideLoadingMessage();
  
      // Show success message after the loading completes
      message.success(`PDF saved successfully! Invoice number: ${invoiceNumber}`);
      
      // Trigger the PDF download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      // Close the loading message in case of an error
      hideLoadingMessage();
      console.error('Error saving PDF:', error);
      message.error('Error generating or saving PDF.');
    }
  };
  



const handleSave = async () => {
  await formik.handleSubmit();
  const formattedInvoiceDate = new Date(invoice.invoiceDate).toISOString();
  const formattedDueDate = new Date(invoice.dueDate).toISOString();

  const formattedItems = products.map((product) => ({
    ProductID: parseInt(invoice.product),
    Description: product.name,
    Quantity: parseInt(product.quantity),
    DiscountType: invoice.discountType,
    DiscountValue: parseFloat(invoice.discountValue),
    Tax: product.tax.toString(),
    TotalTTC: parseFloat(
      (product.quantity * product.rate * (1 + product.tax / 100)).toFixed(3)
    ),
    Notes: invoice.notes,
    Terms: invoice.terms,
    SignatureName: invoice.signatureName,
    Discount: parseFloat(invoice.discountValue),
    Rate: parseFloat(product.rate),
    Amount: parseFloat((product.quantity * product.rate).toFixed(3)),
    Montant_Achat: parseFloat(product.newColumn1),
    Montant_Debourser: parseFloat(product.newColumn2),
  }));

  const invoiceData = {

    client: {
      ClientName: Clients.find((c) => c.Client_ID === invoice.Client_ID)?.ClientName || "",
      ClientAddress: Clients.find((c) => c.Client_ID === invoice.Client_ID)?.ClientAddress || "",
      ClientPhone: Clients.find((c) => c.Client_ID === invoice.Client_ID)?.ClientPhone || "",
      Matricule_fiscale: Clients.find((c) => c.Client_ID === invoice.Client_ID)?.Matricule_fiscale || "",
    },

    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    InvoiceDate: formattedInvoiceDate,
    dueDate: formattedDueDate,
    Status: invoice.status,
    referenceNumber: invoice.referenceNumber,
    DescriptionProduct:
      ReservationProducts.find(
        (p) => p.ProductID === parseInt(invoice.product)
      )?.Type || "",
    TotalHT: parseFloat(calculateAmounts().taxableAmount),
    Discount: parseFloat(calculateAmounts().discount),
    Tva: parseFloat(calculateAmounts().tva),
    Timbre_Fiscal: parseFloat(calculateAmounts().totalTimbreFiscale),
    TotalAmount: parseFloat(calculateAmounts().totalAmount).toFixed(3),
    clientId:
      Clients.find((c) => c.Client_ID === invoice.Client_ID)?.Client_ID || "",
    Items: formattedItems,
  };

  try {
    const response = await AxiosInstance.post(
      "/api/v1/createInvoice",
      invoiceData
    );

    if (response.data.success) {
      console.log("Invoice created successfully", response.data);
      message.success('Facture créée avec succès!');
      setInvoice(initialInvoiceState);
      setProducts([{ name: "", quantity: 0, rate: 0 }]);

      // Call the function to save and download the invoice PDF
      await handleDownloadClickSaveInvoice(response.data.invoiceID, invoice.invoiceNumber, invoiceData);

      // Recall the invoice number fetch and update the input
      await handleInvoiceNumberFetch();
    } else {
      invoice.invoiceNumber = "";
      handleInvoiceNumberFetch();
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    toast.error('Erreur lors de la création de la facture!');
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Config:", error.config);
  }
};


  const handleSend = async () => {
    await handleSave();
    // Additional logic to send the invoice (e.g., via email) can be added here.
  };

  const handleAddProduct = () => {
    const selectedProduct = ReservationProducts.find(
      (product) => product.ProductID === parseInt(invoice.product)
    );

    const newProduct = selectedProduct
      ? {
          name: selectedProduct.Libelle,
          quantity: 0,
          rate: 0,
          tax: selectedProduct.Tva,
          newColumn1: "",
          newColumn2: "",
        }
      : {
          name: "",
          quantity: 0,
          rate: 0,
          tax: 0,
          newColumn1: "",
          newColumn2: "",
        };

    setProducts([...products, newProduct]);
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

      if (parseInt(invoice.product) === 2) {
        // Custom calculation for Billetterie
        const newColumn2 = product.rate * product.quantity - product.newColumn1;
        productTaxableAmount = newColumn2 / (1 + product.tax / 100);
        productTaxAmount = productTaxableAmount * (product.tax / 100);
        productTotalAmount =
          parseFloat(product.rate) * parseFloat(product.quantity);
      } else {
        // Default calculation for other products
        productTaxableAmount = product.quantity * product.rate /(1 + product.tax / 100);
        productTaxAmount =
        product.quantity * product.rate / (1+ product.tax/100) * (product.tax / 100);
        productTotalAmount =
        product.quantity * product.rate / (1+ product.tax/100) * (1 + product.tax / 100);
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

    if( totalDiscount > totalAmount){
      totalDiscount = totalAmount;
      message.error('Le montant de la remise ne peut pas être supérieur au montant total de la facture!');
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

  const filterOption = (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;

    if (name === "product") {
      const selectedProduct = ReservationProducts.find(
        (product) => product.ProductID === parseInt(value)
      );
      if (selectedProduct) {
        newProducts[index].tax = selectedProduct.Tva;
        newProducts[index].name = selectedProduct.Libelle;
      }
    }

    if (name === "rate" || name === "newColumn1") {
      newProducts[index].newColumn2 =
        newProducts[index].rate * newProducts[index].quantity -
        newProducts[index].newColumn1;
    }

    setProducts(newProducts);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleClientNavigationPage = () => {
    navigate("/Dashboard/Client");
  };

  return (
    <div className="invoice-form" id="invoice-form">
      <h1>Add Invoice</h1>
      <div className="form-row">
        <div className="form-group">
          <label>Invoice Number</label>
          <Input
            type="text"
            name="invoiceNumber"
            value={invoice.invoiceNumber}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            disabled
            style={
              formik.touched.invoiceNumber && formik.errors.invoiceNumber
                ? { borderColor: "red" }
                : null
            }
          />
          {formik.touched.invoiceNumber && formik.errors.invoiceNumber ? (
            <span style={{ color: "red", fontSize: 11 }}>
              {" "}
              {formik.errors.invoiceNumber}{" "}
            </span>
          ) : null}
        </div>
        
        <div className="form-group">
  <label>Customer Name</label>
  <Select
    showSearch
    placeholder="Choisissez un client"
    optionFilterProp="children"
    filterOption={filterOption}
    name="customerName"
    value={invoice.customerName || ""} // Ensure value is not undefined
    onChange={(value) => handleChange("customerName", value)}
    style={{ width: "100%", height: 45 }}
    className={
      formik.touched.customerName && formik.errors.customerName
        ? "select-error"
        : ""
    }
    dropdownRender={(menu) => (
      <div>
        {menu}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 8,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Tooltip title="Ajouter un client">
            <Button
              type="primary"
              onClick={handleClientNavigationPage}
              style={{ width: "100%" }}
            >
              Ajouter un client
            </Button>
          </Tooltip>
        </div>
      </div>
    )}
  >
    {Clients.map((client, index) => (
      <Option key={index} value={client.ClientName}>
        {client.ClientName}
      </Option>
    ))}
  </Select>
  {formik.touched.customerName && formik.errors.customerName ? (
    <span style={{ color: "red", fontSize: 11 }}>
      {formik.errors.customerName}
    </span>
  ) : null}
</div>

      
        <div className="form-group">
          <label>Invoice Date</label>
          <Input
            type="date"
            name="invoiceDate"
            value={invoice.invoiceDate}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            style={
              formik.touched.invoiceDate && formik.errors.invoiceDate
                ? { borderColor: "red" }
                : null
            }
          />
          {formik.touched.invoiceDate && formik.errors.invoiceDate ? (
            <span style={{ color: "red", fontSize: 11 }}>
              {" "}
              {formik.errors.invoiceDate}{" "}
            </span>
          ) : null}
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={invoice.dueDate}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            style={
              formik.touched.dueDate && formik.errors.dueDate
                ? { borderColor: "red" }
                : null
            }
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
            <span style={{ color: "red", fontSize: 11 }}>
              {" "}
              {formik.errors.dueDate}{" "}
            </span>
          ) : null}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <Select
            name="status"
            value={invoice.status}
            onChange={(value) => handleChange("status", value)}
            onBlur={formik.handleBlur}
            style={{ width: "100%", height: 45 }}
            className={
              formik.touched.status && formik.errors.status
                ? "select-error"
                : ""
            }
          >
            <Option value="">Choose Status</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Unpaid">Unpaid</Option>
            <Option value="Pending">Partially Paid</Option>
          </Select>
          {formik.touched.status && formik.errors.status ? (
            <span style={{ color: "red", fontSize: 11 }}>
              {" "}
              {formik.errors.status}{" "}
            </span>
          ) : null}
        </div>

        <div className="form-group">
          <label>Products</label>
          <Select
            name="product"
            value={invoice.product}
            onChange={(value) => handleChange("product", value)}
            style={{ width: "100%", height: 45 }}
            className={
              formik.touched.product && formik.errors.product
                ? "select-error"
                : ""
            }
          >
            <Option value="">Select Product</Option>
            {ReservationProducts.map((ReservationProducts, index) => (
              <Option key={index} value={ReservationProducts.ProductID}>
                {ReservationProducts.Type}
              </Option>
            ))}
          </Select>

          {formik.touched.product && formik.errors.product ? (
            <span style={{ color: "red", fontSize: 11 }}>
              {" "}
              {formik.errors.product}{" "}
            </span>
          ) : null}
        </div>
        <div className="form-group">
          <label>Reference Number</label>
          <Input
            type="text"
            name="referenceNumber"
            value={invoice.referenceNumber}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>
      <div className="product-section">
        <table>
          <thead>
            <tr>
              <th>Product / Service</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>P.U TTC</th>
              {parseInt(invoice.product) === 2 && (
                <>
                  <th>Achat</th>
                  <th>Débourser</th>
                </>
              )}
              <th>Tax</th>
              <th>Amount H.T</th>
              <th> &nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faTrash} size="lg" /></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>
                  <Input
                    style={{ width: "100%", minWidth: "400px",fontWeight: "bold"}}
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                <td>
                  <Input
                  style={{fontWeight: "bold"}}
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                <td>Pcs</td>
                <td>
                  <Input
                  style={{fontWeight: "bold"}}
                    type="number"
                    name="rate"
                    value={product.rate}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </td>
                {parseInt(invoice.product) === 2 && (
                  <>
                    <td>
                      <Input
                        type="number"
                        style={{fontWeight: "bold"}}
                        name="newColumn1"
                        value={product.newColumn1}
                        onChange={(e) => handleProductChange(index, e)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        style={{ color: "green",fontWeight: "bold"}}
                        name="newColumn2"
                        value={Number(product.newColumn2).toFixed(3)}
                        onChange={(e) => handleProductChange(index, e)}
                        disabled
                      />
                    </td>
                  </>
                )}
                <td>
                  <Input
                    type="number"
                    name="tax"
                    style={{ color: "red", fontWeight: "bold", width:"65px"}}
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
                        product.rate /
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
          style={{ marginTop: "10px", marginLeft: "10px" }}
          type="primary"
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
        <br/>
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
          <Input
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
          <textarea
            style={{ resize: "none" }}
            name="notes"
            value={invoice.notes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="terms-section">
        <div className="form-group">
          <label>Terms and Conditions</label>
          <textarea
            style={{ resize: "none" }}
            name="terms"
            value={invoice.terms}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="signature-section">
        <div className="form-group">
          <label>Signature Name</label>
          <Input
            style={{ fontFamily: "Brittany Signature", fontStyle: "italic" }}
            type="text"
            name="signatureName"
            value={invoice.signatureName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Signature Image</label>
          <Input
            type="file"
            name="signatureImage"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="total-section">
        <p>Total HT: {calculateAmounts().taxableAmount}</p>
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
     
      </div>
      <div className="qr-code-section">
        <QRCode
          value={`STE KAYAN VOYAGES  Facture N°: ${
            invoice.invoiceNumber
          }, Total Amount: ${calculateAmounts().totalAmount}`}
        />
      </div>
    </div>
  );
};


export default InvoiceComponent;
