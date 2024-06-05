const AgencyModel = require("../models/AgencyModel");


class AgencyController {


static async createAgency(req, res) {
    const {
      AgencyName,
      AgencyAddress,
      AgencyPhone,
      AgencyEmail,
      AgencyLocation,
      SuperAdminID,
      Matricule_fiscale,
     
    } = req.body;
    try {
      const newAgency = await AgencyModel.createAgency(
        AgencyName,
        AgencyAddress,
        AgencyPhone,
        AgencyEmail,
        AgencyLocation,
        SuperAdminID,
        Matricule_fiscale,
       
      );
      if (newAgency.success) {
        res.status(201).json({ success: true, agency: newAgency.agency });
      } else {
        res.status(400).json({ success: false, message: "Agency already exists" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getallAgencies(req, res) {
          try {
            const allAgencies = await AgencyModel.getallAgencies();
            res.status(200).json({ success: true, agencies: allAgencies });
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

module.exports = AgencyController;