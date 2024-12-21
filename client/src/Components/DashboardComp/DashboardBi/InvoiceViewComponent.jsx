import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Input, Button, Select } from "antd";
import QRCode from "qrcode.react";
import "./InvoiceViewComponent.css";



const InvoiceViewComponent = () => {
  const { InvoiceID } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { Option } = Select;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/getInvoiceByID/${InvoiceID}`
        );
        const invoice = response.data.success
          ? response.data.invoice
          : response.data;
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
    return (
    
        navigate(`/Dashboard/ListeFactures/`)
  
    );
  }
  return (
    <div className="invoice-form" id="invoice-form">
      <h1>Add Invoice</h1>
      <div className="form-row">
        <div className="form-group">
          <label>Invoice Number</label>
          <Input
            type="text"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
          />
        </div>
        <div className="form-group">
          <label>Customer Name</label>
          <Select
            showSearch
            placeholder="Choisissez un client"
            optionFilterProp="children"
            value={invoiceData.customerName}
            name="customerName"
            style={{ width: "100%", height: 45 }}
            readOnly
          ></Select>
        </div>
        <div className="form-group">
          <label>Invoice Date</label>
          <Input
            type="date"
            name="invoiceDate"
            value={new Date(invoiceData.InvoiceDate).toLocaleDateString(
              "fr-CA"
            )}
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={new Date(invoiceData.InvoiceDate).toLocaleDateString(
              "fr-CA"
            )}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <Select
            name="status"
            value={invoiceData.Status}
            style={{ width: "100%", height: 45 }}
          ></Select>
        </div>

        <div className="form-group">
          <label>Products</label>
          <Select
            name="product"
            value={invoiceData.DescriptionProduct}
            style={{ width: "100%", height: 45 }}
          ></Select>
        </div>
        <div className="form-group">
          <label>Reference Number</label>
          <Input
            type="text"
            name="referenceNumber"
            value={invoiceData.referenceNumber}
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
              <th>P.U</th>
              {invoiceData.DescriptionProduct === "Billetterie" && (
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
            {invoiceData.Items.map((item, index) => (
              <tr key={index}>
                <td>
                  <Input
                    style={{
                      width: "100%",
                      minWidth: "400px",
                      fontWeight: "bold",
                    }}
                    type="text"
                    name="name"
                    value={item.Description}
                  />
                </td>
                <td>
                  <Input
                    style={{ fontWeight: "bold" }}
                    type="number"
                    name="quantity"
                    value={item.Quantity}
                  />
                </td>
                <td>Pcs</td>
                <td>
                  <Input
                    style={{ fontWeight: "bold" }}
                    type="number"
                    name="rate"
                    value={Number(item.Rate).toFixed(3)}
                  />
                </td>
                {invoiceData.DescriptionProduct === "Billetterie" && (
                  <>
                    <td>
                      <Input
                        type="number"
                        style={{ fontWeight: "bold" }}
                        name="newColumn1"
                        value={item.Montant_Achat}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        style={{ color: "green", fontWeight: "bold" }}
                        name="newColumn2"
                        value={item.Montant_Debourser}
                        disabled
                      />
                    </td>
                  </>
                )}
                <td>
                  <Input
                    type="number"
                    name="tax"
                    style={{ color: "red", fontWeight: "bold" }}
                    value={item.Tax}
                    disabled
                  />
                </td>{" "}
                {/* Tax field */}
                <td>
                  {item.tax
                    ? (
                        item.Quantity *
                        item.Rate *
                        (1 + item.Tax / 100)
                      ).toFixed(3)
                    : (item.Quantity * item.Rate).toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button style={{ marginTop: "10px" }} type="primary">
          Add Product
        </Button>
      </div>
      <div className="discount-section">
        <div className="form-group">
          <label>Discount Type</label>
          <Select
            name="DiscountType"
            value={invoiceData.Items[0]?.DiscountType || ''}
            style={{
              width: "100%",
              height: 48,
              marginBottom: 10,
              marginTop: 6,
            }}
          ></Select>
        </div>
        <div className="form-group">
          <label>Discount</label>
          <Input
            type="number"
            name="discountValue"
            value={invoiceData.Discount}
          />
        </div>
      </div>

      {/* Notes Section */}
      <div className="notes-section">
        <div className="form-group">
          <label>Notes</label>
          <textarea
            style={{ resize: "none", width: "100%" }}
            name="notes"
            value={invoiceData.Items[0]?.Notes || ''}
            readOnly
          ></textarea>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div className="terms-section">
        <div className="form-group">
          <label>Terms and Conditions</label>
          <textarea
            style={{ resize: "none", width: "100%" }}
            name="terms"
            value={invoiceData.Items[0]?.Terms || ''}
            readOnly
          ></textarea>
        </div>
      </div>

      {/* Signature Section */}
      <div className="signature-section">
        <div className="form-group">
          <label>Signature Name</label>
          <Input
            style={{ fontFamily: "Brittany Signature", fontStyle: "italic" }}
            type="text"
            name="signatureName"
            value={invoiceData.Items[0]?.SignatureName || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Signature Image</label>
          <Input type="file" name="signatureImage" />
        </div>
      </div>

      {/* Total Sections */}
      <div className="total-sections">
        <p>Total HT: {Number(invoiceData.TotalHT).toFixed(3)}</p>
        <p>Discount: {Number(invoiceData.Discount).toFixed(3)}</p>
        <p>TVA: {Number(invoiceData.Tva).toFixed(3)}</p>
        <p>Timbre Fiscale: {Number(invoiceData.Timbre_Fiscal).toFixed(3)}</p>
        <p>Total Amount: {Number(invoiceData.TotalAmount).toFixed(3)}</p>
      </div>

      {/* QR Code Section */}
      <div className="qr-code-section">
        <QRCode
          value={`STE KAYAN VOYAGES Facture N°: ${invoiceData.invoiceNumber}, Total Amount: ${Number(invoiceData.TotalAmount).toFixed(3)}`}
        />
      </div>

      {/* Uncomment these buttons if needed */}
      {/* 
      <div className="buttons-section">
        <button type="button" className="btn btn-save">Save</button>
        <button type="button" className="btn btn-send">Save & Send</button>
        <button type="button" className="btn btn-download">Download PDF</button>
      </div>
      */}
    </div>
  );
};

export default InvoiceViewComponent;