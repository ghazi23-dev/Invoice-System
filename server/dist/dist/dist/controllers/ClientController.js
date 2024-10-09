const ClientModel = require("../models/ClientModel");
class ClientController {
  static async CreateClient(req, res) {
    const {
      ClientName,
      ClientPhone,
      ClientEmail,
      ClientAddress,
      ClientLocation,
      Matricule_fiscale
    } = req.body;
    try {
      const newClient = await ClientModel.CreateClient(ClientName, ClientPhone, ClientEmail, ClientAddress, ClientLocation, Matricule_fiscale);
      if (newClient.success) {
        res.status(201).json({
          success: true,
          client: newClient.client
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Client already exists"
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
  static async getAllClient(req, res) {
    try {
      const allClients = await ClientModel.getAllClient();
      res.status(200).json({
        success: true,
        clients: allClients
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
  static async GetClientByID(req, res) {
    try {
      const client = await ClientModel.GetClientByID(req.params.Client_ID);
      if (client) {
        res.json(client);
      } else {
        res.status(404).json({
          error: "Client not found"
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the user from the database"
      });
    }
  }
  static async UpdateClient(req, res) {
    const {
      ClientName,
      ClientPhone,
      ClientEmail,
      ClientAddress,
      ClientLocation,
      Matricule_fiscale
    } = req.body;
    try {
      const client = await ClientModel.UpdateClient(req.params.Client_ID, {
        ClientName,
        ClientPhone,
        ClientEmail,
        ClientAddress,
        ClientLocation,
        Matricule_fiscale
      });
      if (client) {
        res.status(200).json({
          success: true,
          message: "Client updated successfully",
          client: client
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Client not found"
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
}
module.exports = ClientController;