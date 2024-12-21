const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const path = require('path');



app.use(cors({
  origin: "http://localhost:5173",
  // origin: "https://facturations.kayanvoyages.tn",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,

}));

app.use(cookieParser());


app.use('/pdfs', express.static(path.join(__dirname, './pdfs')));



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







app.listen(3004, () => {
  console.log("Server is running on port 3004");
});
