const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,

}));

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
