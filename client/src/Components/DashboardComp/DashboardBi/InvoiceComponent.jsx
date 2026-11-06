import { useState, useEffect } from "react";
import { FilePlus2, Plus, Save, Send, Trash2, UserPlus } from "lucide-react";
import QRCode from "qrcode.react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import AxiosInstance from "../../../Auth/AxiosInstance";
import axiosInstance from "../../../Auth/AxiosInstance";
import PDFRenderComponent from "./Row_PDF_Reglement_Quittance";
import { PageHeader } from "@/Components/ui/page-header";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { NativeSelect } from "@/Components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Field, fieldError } from "@/Components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { formatAmount } from "@/lib/format";

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

const statusOptions = [
  { value: "Paid", label: "Payée" },
  { value: "Unpaid", label: "Impayée" },
  { value: "Pending", label: "Partiellement payée" },
];

const SectionCard = ({ title, description, children, actions }) => (
  <Card>
    <CardHeader className={actions ? "flex-row items-center justify-between gap-3 pb-2" : "pb-2"}>
      <div className="min-w-0">
        <CardTitle>{title}</CardTitle>
        {description && <p className="m-0 mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </CardHeader>
    <CardContent className="pt-4">{children}</CardContent>
  </Card>
);

const TotalRow = ({ label, value, strong }) => (
  <div className={strong ? "flex items-center justify-between border-t pt-2.5" : "flex items-center justify-between"}>
    <span className={strong ? "text-sm font-semibold" : "text-sm text-muted-foreground"}>{label}</span>
    <span className={strong ? "text-base font-semibold tabular-nums" : "text-sm font-medium tabular-nums"}>{value}</span>
  </div>
);

const InvoiceComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    { name: "", quantity: 0, rate: 0 },
  ]);
  const [ReservationProducts, setReservationProducts] = useState([]);
  const [Clients, setClients] = useState([]);
  const [downloadInvoiceID, setDownloadInvoiceID] = useState(null);
  const [saving, setSaving] = useState(false);

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
        const selectedClient = Clients.find((client) => client.ClientName === value);
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
        const updatedProducts = products.map((product) => {
          return {
            ...product,
            tax: selectedProduct.Tva,
            name: selectedProduct.Libelle,
          };
        });
        setProducts(updatedProducts);
      }
    }
  };

  const handleDownloadClickSaveInvoice = async (invoiceID, invoiceNumber, invoiceData) => {
    setDownloadInvoiceID(invoiceID);

    // Show a loading toast and keep it open until PDF generation completes
    const toastId = toast.loading("Génération du PDF, veuillez patienter…");

    try {
      // Generate the PDF, using invoiceData instead of data
      const blob = await pdf(<PDFRenderComponent record={invoiceData} />).toBlob();

      // Create form data
      const formData = new FormData();
      formData.append("file", blob, `Invoice_${invoiceNumber}.pdf`);

      // Send the PDF to the server
      const response = await axiosInstance.post(`/api/v1/saveInvoicePdf/${invoiceNumber}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("PDF saved successfully!", response.data);

      toast.update(toastId, {
        render: `PDF enregistré ! Facture N° : ${invoiceNumber}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Trigger the PDF download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.update(toastId, {
        render: "Erreur lors de la génération ou de l'enregistrement du PDF.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      console.error("Error saving PDF:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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
        TotalTTC: parseFloat((product.quantity * product.rate * (1 + product.tax / 100)).toFixed(3)),
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
          ReservationProducts.find((p) => p.ProductID === parseInt(invoice.product))?.Type || "",
        TotalHT: parseFloat(calculateAmounts().taxableAmount),
        Discount: parseFloat(calculateAmounts().discount),
        Tva: parseFloat(calculateAmounts().tva),
        Timbre_Fiscal: parseFloat(calculateAmounts().totalTimbreFiscale),
        TotalAmount: parseFloat(calculateAmounts().totalAmount).toFixed(3),
        clientId: Clients.find((c) => c.Client_ID === invoice.Client_ID)?.Client_ID || "",
        Items: formattedItems,
      };

      try {
        const response = await AxiosInstance.post("/api/v1/createInvoice", invoiceData);

        if (response.data.success) {
          console.log("Invoice created successfully", response.data);
          toast.success("Facture créée avec succès !");
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
        toast.error("Erreur lors de la création de la facture !");
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
    } finally {
      setSaving(false);
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

      // Harden numeric inputs (an empty article row has no tax / newColumn1 yet)
      const tax = parseFloat(product.tax) || 0;
      const achat = parseFloat(product.newColumn1) || 0;

      if (parseInt(invoice.product) === 2) {
        // Custom calculation for Billetterie
        const newColumn2 = product.rate * product.quantity - achat;
        productTaxableAmount = newColumn2 / (1 + tax / 100);
        productTaxAmount = productTaxableAmount * (tax / 100);
        productTotalAmount = parseFloat(product.rate) * parseFloat(product.quantity);
      } else {
        // Default calculation for other products
        productTaxableAmount = (product.quantity * product.rate) / (1 + tax / 100);
        productTaxAmount = ((product.quantity * product.rate) / (1 + tax / 100)) * (tax / 100);
        productTotalAmount = ((product.quantity * product.rate) / (1 + tax / 100)) * (1 + tax / 100);
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

    if (totalDiscount > totalAmount) {
      totalDiscount = totalAmount;
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

  // Warn (once per change) when the discount exceeds the invoice total — this
  // used to fire an antd message from inside the render path on every calculation.
  const amounts = calculateAmounts();
  useEffect(() => {
    let totalAmount = 0;
    products.forEach((product) => {
      const tax = parseFloat(product.tax) || 0;
      if (parseInt(invoice.product) === 2) {
        totalAmount += parseFloat(product.rate) * parseFloat(product.quantity);
      } else {
        totalAmount += ((product.quantity * product.rate) / (1 + tax / 100)) * (1 + tax / 100);
      }
    });
    const discountValue = parseFloat(invoice.discountValue) || 0;
    const totalDiscount =
      invoice.discountType === "Percentage(%)" ? (totalAmount * discountValue) / 100 : discountValue;
    if (totalDiscount > totalAmount) {
      toast.error("Le montant de la remise ne peut pas être supérieur au montant total de la facture !");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.discountValue, invoice.discountType]);

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

    // Block negative values on the numeric article fields (quantity, prices)
    if (name === "quantity" || name === "rate" || name === "newColumn1") {
      const n = parseFloat(value);
      newProducts[index][name] = value === "" || !Number.isFinite(n) ? "" : String(Math.max(0, n));
    }

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
        newProducts[index].rate * newProducts[index].quantity - newProducts[index].newColumn1;
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

  const isBilletterie = parseInt(invoice.product) === 2;

  return (
    <>
      <PageHeader
        icon={FilePlus2}
        title="Nouvelle facture"
        description="Créez une facture, générez et archivez son PDF."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* ---------------- Informations ---------------- */}
          <SectionCard title="Informations de la facture">
            <div className="mb-5 flex flex-wrap items-center gap-x-10 gap-y-2 rounded-lg bg-muted/40 px-4 py-3">
              <div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">N° de facture</p>
                <p className="m-0 font-mono text-sm font-semibold text-primary">{invoice.invoiceNumber || "—"}</p>
              </div>
              <div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Référence</p>
                <p className="m-0 font-mono text-sm font-semibold">{invoice.referenceNumber || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Client"
                required
                error={fieldError(formik, "customerName")}
                className="sm:col-span-2 lg:col-span-4"
              >
                <NativeSelect
                  name="customerName"
                  value={invoice.customerName || ""}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Choisir un client"
                  invalid={!!fieldError(formik, "customerName")}
                >
                  {Clients.map((client, index) => (
                    <option key={index} value={client.ClientName}>
                      {client.ClientName}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Date de facturation" required error={fieldError(formik, "invoiceDate")}>
                <Input
                  type="date"
                  name="invoiceDate"
                  value={invoice.invoiceDate}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!fieldError(formik, "invoiceDate")}
                />
              </Field>
              <Field label="Date d'échéance" required error={fieldError(formik, "dueDate")}>
                <Input
                  type="date"
                  name="dueDate"
                  value={invoice.dueDate}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!fieldError(formik, "dueDate")}
                />
              </Field>
              <Field label="Statut" required error={fieldError(formik, "status")}>
                <Select value={invoice.status || undefined} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger aria-invalid={!!fieldError(formik, "status") || undefined}>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Produit" required error={fieldError(formik, "product")}>
                <Select value={invoice.product || undefined} onValueChange={(value) => handleChange("product", value)}>
                  <SelectTrigger aria-invalid={!!fieldError(formik, "product") || undefined}>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {ReservationProducts.map((produit, index) => (
                      <SelectItem key={index} value={String(produit.ProductID)}>
                        {produit.Type} — {produit.Libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClientNavigationPage}>
                <UserPlus /> Ajouter un client
              </Button>
              <p className="m-0 text-xs text-muted-foreground">Le client n'est pas dans la liste ? Créez-le d'abord.</p>
            </div>
          </SectionCard>

          {/* ---------------- Articles ---------------- */}
          <SectionCard
            title="Articles"
            description="Désignation, quantité et prix unitaire TTC de chaque ligne."
            actions={
              <Button variant="outline" size="sm" onClick={handleAddProduct}>
                <Plus /> Ajouter un article
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="min-w-[240px]">Désignation</TableHead>
                    <TableHead className="w-[100px] text-center">Quantité</TableHead>
                    <TableHead className="w-[70px] text-center">Unité</TableHead>
                    <TableHead className="w-[120px] text-right">P.U TTC</TableHead>
                    {isBilletterie && (
                      <>
                        <TableHead className="w-[110px] text-right">Achat</TableHead>
                        <TableHead className="w-[120px] text-right">Débourser</TableHead>
                      </>
                    )}
                    <TableHead className="w-[80px] text-right">TVA</TableHead>
                    <TableHead className="w-[120px] text-right">Montant H.T</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={(e) => handleProductChange(index, e)}
                          className="h-9 font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="quantity"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, e)}
                          min="0"
                          className="h-9 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">Pcs</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="rate"
                          value={product.rate}
                          onChange={(e) => handleProductChange(index, e)}
                          min="0"
                          className="h-9 text-right"
                        />
                      </TableCell>
                      {isBilletterie && (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              name="newColumn1"
                              value={product.newColumn1}
                              onChange={(e) => handleProductChange(index, e)}
                              min="0"
                              className="h-9 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              name="newColumn2"
                              value={Number(product.newColumn2).toFixed(3)}
                              onChange={(e) => handleProductChange(index, e)}
                              disabled
                              className="h-9 text-right"
                            />
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Input
                          type="number"
                          name="tax"
                          value={product.tax}
                          disabled
                          className="h-9 w-[65px] text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {product.tax
                          ? ((product.quantity * product.rate) / (1 + product.tax / 100)).toFixed(3)
                          : (product.quantity * product.rate).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost-destructive"
                          size="icon-sm"
                          title="Supprimer"
                          onClick={() => handleDeleteProduct(index)}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>

          {/* ---------------- Notes & conditions ---------------- */}
          <SectionCard title="Notes & conditions" description="Mentions librement imprimées sur la facture.">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Notes">
                <Textarea
                  name="notes"
                  value={invoice.notes}
                  onChange={handleChange}
                  placeholder="Notes internes ou mentions pour le client…"
                />
              </Field>
              <Field label="Conditions générales">
                <Textarea
                  name="terms"
                  value={invoice.terms}
                  onChange={handleChange}
                  placeholder="Conditions de paiement, délais…"
                />
              </Field>
            </div>
          </SectionCard>

          {/* ---------------- Signature ---------------- */}
          <SectionCard title="Signature">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nom de la signature" required error={fieldError(formik, "signatureName")}>
                <Input
                  name="signatureName"
                  value={invoice.signatureName}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!fieldError(formik, "signatureName")}
                  className="[font-family:'Brittany_Signature',cursive] text-xl"
                />
              </Field>
              <Field label="Image de la signature" hint="PNG ou JPG — ajoutée au pied de la facture.">
                <Input type="file" name="signatureImage" onChange={handleFileChange} className="h-auto py-1.5" />
              </Field>
            </div>
          </SectionCard>
        </div>

        {/* ---------------- Summary sidebar ---------------- */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-24 xl:h-fit">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Type de remise">
                  <NativeSelect name="discountType" value={invoice.discountType} onChange={handleChange} className="h-9 text-[13px]">
                    <option value="Percentage(%)">Percentage(%)</option>
                    <option value="Flat">Flat</option>
                  </NativeSelect>
                </Field>
                <Field label="Remise" hint={fieldError(formik, "discountValue")}>
                  <Input
                    type="number"
                    name="discountValue"
                    value={invoice.discountValue}
                    onChange={handleChange}
                    min="0"
                    className="h-9"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-2.5 border-t pt-4">
                <TotalRow label="Total HT" value={formatAmount(amounts.taxableAmount)} />
                <TotalRow label="TVA" value={formatAmount(amounts.tva)} />
                <TotalRow label="Timbre fiscal" value={formatAmount(amounts.totalTimbreFiscale)} />
                <TotalRow label="Remise" value={`- ${formatAmount(amounts.discount)}`} />
                <TotalRow label="Total TTC" value={`${formatAmount(amounts.totalAmount)} DT`} strong />
              </div>

              <div className="flex justify-center rounded-xl border bg-muted/30 p-3">
                <QRCode
                  size={96}
                  value={`STE KAYAN VOYAGES  Facture N°: ${
                    invoice.invoiceNumber
                  }, Total Amount: ${calculateAmounts().totalAmount}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2.5 pt-6">
              <Button onClick={handleSave} loading={saving} className="w-full">
                <Save /> Enregistrer
              </Button>
              <Button variant="accent" onClick={handleSend} loading={saving} className="w-full">
                <Send /> Enregistrer &amp; envoyer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default InvoiceComponent;
