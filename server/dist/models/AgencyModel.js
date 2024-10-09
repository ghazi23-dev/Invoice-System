const {
  PrismaClient
} = require("@prisma/client");
const prisma = new PrismaClient();
class AgencyModel {
  static async createAgency(AgencyName, AgencyAddress, AgencyPhone, AgencyEmail, AgencyLocation, SuperAdminID, Matricule_fiscale) {
    try {
      const newAgency = await prisma.agency.create({
        data: {
          AgencyName: AgencyName,
          AgencyAddress: AgencyAddress,
          AgencyPhone: AgencyPhone,
          AgencyEmail: AgencyEmail,
          AgencyLocation: AgencyLocation,
          SuperAdminID: parseInt(SuperAdminID, 10),
          Matricule_fiscale: Matricule_fiscale,
          created_at: new Date()
        }
      });
      return {
        success: true,
        agency: newAgency
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getallAgencies() {
    try {
      const allAgencies = await prisma.agency.findMany();
      return allAgencies;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async GetAgencyByID(Agency_ID) {
    try {
      const agency = await prisma.agency.findUnique({
        where: {
          Agency_ID: parseInt(Agency_ID)
        },
        include: {
          Admin: {
            select: {
              fullname: true // Assuming Admin's name field is UserName
            }
          }
        }
      });
      return agency;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async createAchatReservation(data) {
    try {
      const createdReservation = await prisma.achat_Reservation.create({
        data: {
          DATE: new Date(data.DATE).toISOString(),
          // Convert to ISO 8601 format
          AGENT: data.AGENT,
          DESIGNATION: data.DESIGNATION,
          PLATEFORME: data.PLATEFORME,
          NOM_CLIENT: data.NOM_CLIENT,
          CONTACT_CLIENT: data.CONTACT_CLIENT,
          DATE_ENTREE: new Date(data.DATE_ENTREE).toISOString(),
          // Convert to ISO 8601 format
          REGLEMENT: data.REGLEMENT,
          NUMERO_RECU: data.NUMERO_RECU,
          PRIX_VENTE: data.PRIX_VENTE,
          PRIX_ACHAT: data.PRIX_ACHAT,
          AVANCE: data.AVANCE,
          RESTE: data.RESTE,
          OBSERVATION: data.OBSERVATION
        }
      });
      return createdReservation;
    } catch (error) {
      console.error('Error creating Achat Reservation:', error);
      throw error;
    }
  }
  static async getallAchatReservations() {
    try {
      const allAchatReservations = await prisma.achat_Reservation.findMany();
      return allAchatReservations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async updateAchatReservation(AchatID, data) {
    try {
      const updatedReservation = await prisma.achat_Reservation.update({
        where: {
          AchatID: parseInt(AchatID)
        },
        data: {
          DATE: new Date(data.DATE).toISOString(),
          // Convert to ISO 8601 format                            AGENT: data.AGENT,
          DESIGNATION: data.DESIGNATION,
          PLATEFORME: data.PLATEFORME,
          NOM_CLIENT: data.NOM_CLIENT,
          CONTACT_CLIENT: data.CONTACT_CLIENT,
          DATE_ENTREE: new Date(data.DATE_ENTREE).toISOString(),
          // Convert to ISO 8601 format
          REGLEMENT: data.REGLEMENT,
          NUMERO_RECU: data.NUMERO_RECU,
          PRIX_VENTE: data.PRIX_VENTE,
          PRIX_ACHAT: data.PRIX_ACHAT,
          AVANCE: data.AVANCE,
          RESTE: data.RESTE,
          OBSERVATION: data.OBSERVATION
        }
      });
      return updatedReservation;
    } catch (error) {
      console.error('Error updating Achat Reservation:', error);
      throw error;
    }
  }
  static async getInvoicebyID() {}
}
module.exports = AgencyModel;