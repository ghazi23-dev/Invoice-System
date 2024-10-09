const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const path = require('path');





// app.post('/generate-invoice', async (req, res) => {
//     try {
//         const invoiceData = {
//             customerName: req.body.customerName || 'John Doe',
//             totalAmount: req.body.totalAmount || '150.00',
//             date: new Date().toLocaleDateString(),
//         };

//         const fileName = `invoice_${Date.now()}`;
//         const pdfPath = await generateInvoicePDF(invoiceData, fileName);

//         res.json({ message: 'Invoice generated successfully', pdfPath });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to generate invoice PDF' });
//     }
// });






app.use(cors({
  origin: "http://localhost:5173",
  // origin: "https://facturations.kayanvoyages.tn",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,

}));

app.use(cookieParser());


app.use('/pdfs', express.static(path.join(__dirname, '../pdfs')));







  



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


const ffRouter = require("./routes/ff");
app.use(ffRouter);






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
