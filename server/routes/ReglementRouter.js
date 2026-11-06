const express = require("express");
const ReglementRouter = express.Router();

const ReglementController = require("../controllers/ReglementController");
const authenticateToken = require("../middleware/middleware");

ReglementRouter.get("/api/v1/getReglements", authenticateToken, ReglementController.getReglements);
ReglementRouter.post("/api/v1/addReglement", authenticateToken, ReglementController.addReglement);
ReglementRouter.delete("/api/v1/deleteReglement/:ReglementID", authenticateToken, ReglementController.DeleteReglement);

module.exports = ReglementRouter;
