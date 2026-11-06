// const express = require("express");
// const app = express();
// const { PrismaClient } = require("@prisma/client");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// require('dotenv').config();
// const path = require('path');



// app.use(cors({
//   origin: "http://192.168.1.99:5173",
//   // origin: "https://facturations.kayanvoyages.tn",
//   methods: ["POST", "GET", "PUT", "DELETE"],
//   credentials: true,

// }));

// app.use(cookieParser());


// app.use('/pdfs', express.static(path.join(__dirname, './pdfs')));



// /*/ USER ROUTER /*/
// const UserRouter = require("./routes/UserRouter");
// app.use(UserRouter);

// /*/ AGENCY ROUTER /*/
// const AgencyRouter = require("./routes/AgencyRouter");
// app.use(AgencyRouter);

// /*/ PRODUCT ROUTER /*/
// const ProductRouter = require("./routes/ProduitRouter");
// app.use(ProductRouter);

// /*/ INVOICE ROUTER /*/
// const InvoiceRouter = require("./routes/InvoiceRouter");
// app.use(InvoiceRouter);

// /*/ CLIENT ROUTER /*/
// const ClientRouter = require("./routes/ClientRouter");
// app.use(ClientRouter);


// const ffRouter = require("./routes/ff");
// app.use(ffRouter);






// app.listen(3004, '0.0.0.0', () => {
//   console.log("Server is running on http://0.0.0.0:3004");
// });

const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  // origin: "http://192.168.1.202:3004",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));


app.use(cookieParser());

// Serve PDF static files (Reglement router mounted below)
app.use("/pdfs", express.static(path.join(__dirname, "./pdfs")));

// API routes
const UserRouter = require("./routes/UserRouter");
app.use(UserRouter);

const AgencyRouter = require("./routes/AgencyRouter");
app.use(AgencyRouter);

const ProductRouter = require("./routes/ProduitRouter");
app.use(ProductRouter);

const InvoiceRouter = require("./routes/InvoiceRouter");
app.use(InvoiceRouter);

const ClientRouter = require("./routes/ClientRouter");
app.use(ClientRouter);

const ReglementRouter = require("./routes/ReglementRouter");
app.use(ReglementRouter);

const ffRouter = require("./routes/ff");
app.use(ffRouter);

// Serve React frontend build from 'dist' folder
app.use(express.static(path.join(__dirname, "../client/dist")));

// For any other route, serve React's index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server
app.listen(3004, "0.0.0.0", () => {
  console.log("Server is running on http://0.0.0.0:3004");
});

