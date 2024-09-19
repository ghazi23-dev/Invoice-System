const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ClientModel {
  static async CreateClient(
    ClientName,
    ClientPhone,
    ClientEmail,
    ClientAddress,
    ClientLocation,
    Matricule_fiscale
  ) {
    try {
      const newClient = await prisma.client.create({
        data: {
          ClientName: ClientName.trim(),
          ClientPhone: ClientPhone ? ClientPhone.trim() : "", // Check if ClientPhone is provided
          ClientEmail: ClientEmail ? ClientEmail.trim() : "", // Check if ClientEmail is provided
          ClientAddress: ClientAddress ? ClientAddress.trim() : "", // Check if ClientAddress is provided
          ClientLocation: ClientLocation ? ClientLocation.trim() : "", // Check if ClientLocation is provided
          Matricule_fiscale: Matricule_fiscale ? Matricule_fiscale.trim() : "", // Check if Matricule_fiscale is provided
          created_at: new Date(),
        },
      });
      return { success: true, client: newClient };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  static async getAllClient() {
    try {
      const allClients = await prisma.client.findMany();
      return allClients;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async GetClientByID(Client_ID) {
    try {
      const client = await prisma.client.findUnique({
        where: {
          Client_ID: parseInt(Client_ID),
        },
      });
      return client;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async UpdateClient(Client_ID, data) {
    try {
      const client = await prisma.client.update({
        where: {
          Client_ID: parseInt(Client_ID),
        },
        data: {
          ClientName: data.ClientName,
          ClientPhone: data.ClientPhone,
          ClientEmail: data.ClientEmail,
          ClientAddress: data.ClientAddress,
          ClientLocation: data.ClientLocation,
          Matricule_fiscale: data.Matricule_fiscale,
        },
      });
      return client;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


module.exports = ClientModel;
