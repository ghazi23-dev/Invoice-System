const ReglementModel = require("../models/ReglementModel");

class ReglementController {
  static async getReglements(req, res) {
    try {
      const reglements = await ReglementModel.getReglements();

      return res.status(200).json({
        success: true,
        reglements,
      });
    } catch (error) {
      console.error("Error in getReglements controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching reglements",
        error: error.message,
      });
    }
  }

  static async addReglement(req, res) {
    try {
      const data = req.body;

      if (!data.InvoiceID || !data.Montant || !data.Mode || !data.DateReglement) {
        return res.status(400).json({
          success: false,
          message: "InvoiceID, Montant, Mode and DateReglement are required",
        });
      }

      const reglement = await ReglementModel.addReglement(data);

      return res.status(201).json({
        success: true,
        message: "Reglement added successfully",
        reglement,
      });
    } catch (error) {
      console.error("Error in addReglement controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding reglement",
        error: error.message,
      });
    }
  }

  static async DeleteReglement(req, res) {
    try {
      const { ReglementID } = req.params;

      await ReglementModel.DeleteReglement(ReglementID);

      return res.status(200).json({
        success: true,
        message: "Reglement deleted successfully",
      });
    } catch (error) {
      console.error("Error in DeleteReglement controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting reglement",
        error: error.message,
      });
    }
  }
}

module.exports = ReglementController;
