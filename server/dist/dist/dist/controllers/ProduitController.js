const ProduitModel = require("../models/ProduitModel");
class ProduitController {
  static async createProduit(req, res) {
    const {
      Libelle,
      Type,
      Tva
    } = req.body;
    try {
      const newProduit = await ProduitModel.createProduit(Libelle, Type, Tva);
      if (newProduit.success) {
        res.status(201).json({
          success: true,
          product: newProduit.product
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Produit Already Exists"
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
  static async getallProduit(req, res) {
    try {
      const allProduit = await ProduitModel.getallProduit();
      res.status(200).json({
        success: true,
        Produits: allProduit
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
  static async deleteProduit(req, res) {
    const {
      ProductID
    } = req.params;
    try {
      const deletedProduit = await ProduitModel.deleteProduit(ProductID);
      res.status(200).json({
        success: true,
        Produit: deletedProduit
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}
module.exports = ProduitController;