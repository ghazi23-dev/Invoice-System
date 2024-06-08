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
      const newClient = await ClientModel.CreateClient(
          ClientName,
          ClientPhone,
          ClientEmail,
          ClientAddress,
          ClientLocation,
          Matricule_fiscale
       
      );
      if (newClient.success) {
        res.status(201).json({ success: true, client: newClient.client });
      } else {
        res.status(400).json({ success: false, message: "Client already exists" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getAllClient(req, res) {
          try {
            const allClients = await ClientModel.getAllClient();
            res.status(200).json({ success: true, clients: allClients });
          } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
          }
            }  
            
            static async GetAgencyByID(req, res) {
              try {
                const user = await AgencyModel.GetAgencyByID(req.params.Agency_ID);
                if (user) {
                  res.json(user);
                } else {
                  res.status(404).json({ error: "Agency not found" });
                }
              } catch (error) {
                console.error(error);
                res.status(500).json({
                  error: "There was an error while fetching the user from the database",
                });
              }
            }

            static async createAchatReservation(req, res) {
              const {
                DATE,
                AGENT,
                DESIGNATION,
                PLATEFORME,
                NOM_CLIENT,
                CONTACT_CLIENT,
                DATE_ENTREE,
                REGLEMENT,
                NUMERO_RECU,
                PRIX_VENTE,
                PRIX_ACHAT,
                AVANCE,
                RESTE,
                OBSERVATION,
              } = req.body;
            
              // Parse PRIX_VENTE and PRIX_ACHAT from string to float
              const parsedPrixVente = parseFloat(PRIX_VENTE);
              const parsedPrixAchat = parseFloat(PRIX_ACHAT);
              const parsedAvance = parseFloat(AVANCE);
              const parsedReste = parseFloat(RESTE);
            
              try {
                const newAchatReservation = await AgencyModel.createAchatReservation({
                  DATE,
                  AGENT,
                  DESIGNATION,
                  PLATEFORME,
                  NOM_CLIENT,
                  CONTACT_CLIENT,
                  DATE_ENTREE,
                  REGLEMENT,
                  NUMERO_RECU,
                  PRIX_VENTE: parsedPrixVente,
                  PRIX_ACHAT: parsedPrixAchat,
                  AVANCE: parsedAvance,
                  RESTE : parsedReste,
                  OBSERVATION,
                });
                if (newAchatReservation) {
                  res.status(201).json({ success: true, achatReservation: newAchatReservation });
                } else {
                  res.status(400).json({ success: false, message: "Failed to create Achat Reservation" });
                }
              } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
              }
            }

            static async getallAchatReservations(req, res) {
              try {
                const allAchatReservations = await AgencyModel.getallAchatReservations();
                res.status(200).json({ success: true, achatReservations: allAchatReservations });
              } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
              }
            }

            static async updateAchatReservation(req, res) {

              const {
                DATE,
                AGENT,
                DESIGNATION,
                PLATEFORME,
                NOM_CLIENT,
                CONTACT_CLIENT,
                DATE_ENTREE,
                REGLEMENT,
                NUMERO_RECU,
                PRIX_VENTE,
                PRIX_ACHAT,
                AVANCE,
                RESTE,
                OBSERVATION,
              } = req.body;
            
              // Parse PRIX_VENTE and PRIX_ACHAT from string to float
              const parsedPrixVente = parseFloat(PRIX_VENTE);
              const parsedPrixAchat = parseFloat(PRIX_ACHAT);
              const parsedAvance = parseFloat(AVANCE);
              const parsedReste = parseFloat(RESTE);
            
              try {
                const updatedAchatReservation = await AgencyModel.updateAchatReservation(req.params.AchatID, {
                  DATE,
                  AGENT,
                  DESIGNATION,
                  PLATEFORME,
                  NOM_CLIENT,
                  CONTACT_CLIENT,
                  DATE_ENTREE,
                  REGLEMENT,
                  NUMERO_RECU,
                  PRIX_VENTE: parsedPrixVente,
                  PRIX_ACHAT: parsedPrixAchat,
                  AVANCE: parsedAvance,
                  RESTE : parsedReste,
                  OBSERVATION,
                });
                if (updatedAchatReservation) {
                  res.status(200).json({ success: true, achatReservation: updatedAchatReservation });
                } else {
                  res.status(400).json({ success: false, message: "Failed to update Achat Reservation" });
                }
              } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
              }
            }
            
            
}

module.exports = ClientController;