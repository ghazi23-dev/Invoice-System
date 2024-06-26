const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());


const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const fs = require('fs');

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,

}));


app.get('/api/v1/downloadInvoice/:invoiceID', async (req, res) => {
  const { invoiceID } = req.params;

  // Fetch invoice data from the database using invoiceID
  const invoiceData = await getInvoiceData(invoiceID);

  if (!invoiceData) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper functions
  const drawText = (text, x, y, size = 12, options = {}) => {
    page.drawText(text, { x, y, size, font, ...options });
  };

  const drawTableRows = (items, startY) => {
    let yPosition = startY;
    items.forEach((item, index) => {
      drawText(item.Description, 100, yPosition, 10);
      drawText(item.Quantity.toString(), 200, yPosition, 10);
      drawText(item.Rate.toFixed(3), 300, yPosition, 10);
      drawText(item.Amount.toFixed(3), 400, yPosition, 10);
      yPosition -= 20;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };






  // Draw the invoice header
  drawText(`Facture N°: ${invoiceData.invoiceNumber}`, 50, 780, 20, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
  drawText('KAYAN VOYAGES', 50, 760, 12);
  drawText('AV de La République Monastir 5060', 50, 740, 12);
  drawText('(+216)73501021', 50, 720, 12);
  drawText('MF: 1717704 R/A/M/000', 50, 700, 12);

  // Draw client details
  drawText(invoiceData.client.ClientName, 50, 680, 12);
  drawText(invoiceData.client.ClientAddress, 50, 660, 12);
  drawText(invoiceData.client.ClientLocation, 50, 640, 12);
  drawText(invoiceData.client.Matricule_fiscale, 50, 620, 12);

  // Draw invoice date
  drawText(`Monastir le ${formatDate(invoiceData.InvoiceDate)}`, 400, 600, 12);

  // Draw the table header
  drawText('Référence', 50, 560, 12, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
  drawText('Désignation', 100, 560, 12, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
  drawText('Quantité', 200, 560, 12, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
  drawText('P.U', 300, 560, 12, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
  drawText('Montant Total', 400, 560, 12, { font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });

  // Draw the table rows
  drawTableRows(invoiceData.Items, 540);

  // Add more text and tables as needed, following the same pattern...

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoiceData.invoiceNumber}.pdf`);
  res.send(Buffer.from(pdfBytes));
});

// Placeholder function, replace with actual database query
const getInvoiceData = async (invoiceID) => {
  return {
    invoiceNumber: `INV-${invoiceID}`,
    client: {
      ClientName: 'John Doe',
      ClientAddress: '123 Main St',
      ClientLocation: 'Monastir',
      Matricule_fiscale: 'MF12345',
    },
    Items: [
      { Description: 'Item 1', Quantity: 1, Rate: 100.0, Amount: 100.0 },
      { Description: 'Item 2', Quantity: 2, Rate: 50.0, Amount: 100.0 },
    ],
    InvoiceDate: '2024-06-12',
    TotalAmount: 200.0,
    TotalHT: 150.0,
    Tva: 50.0,
    Timbre_Fiscal: 0.5,
    CreatedAt: '2024-06-11',
    localData: 'Agent Name',
    Discount: 0,
  };
};



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*/ USER ROUTER /*/
const UserRouter = require("./routes/UserRouter");
app.use(UserRouter);

/*/ AGENCY ROUTER /*/
const AgencyRouter = require("./routes/AgencyRouter");
app.use(AgencyRouter);

/*/ PRODUCT ROUTER /*/
const ProductRouter = require("./routes/ProduitRouter");
app.use(ProductRouter);

/*/ INVOICE ROUTER /*/
const InvoiceRouter = require("./routes/InvoiceRouter");
app.use(InvoiceRouter);

/*/ CLIENT ROUTER /*/
const ClientRouter = require("./routes/ClientRouter");
app.use(ClientRouter);





// app.get("/", async (req, res) => {
//   const allUsers = await prisma.users.findMany();
//   res.json(allUsers);
// });

// app.post("/", async (req, res) => {
//   const newUser = await prisma.users.create({ data: req.body });
//   res.json(newUser);
// });

// app.put("/:id", async (req, res) => {
//           const { id } = req.params;
//           const updatedUser = await prisma.users.update({
//           where: { id: parseInt(id) },
//           data: req.body,
//           });
//           res.json(updatedUser);
//           });

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
