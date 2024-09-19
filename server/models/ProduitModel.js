const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ProduitModel {

          static async createProduit(
                    Libelle,
                    Type,
                    Tva,
                    
                  ) {
                    try {
                      const newProduit = await prisma.product.create({
                        data: {
                         Libelle : Libelle,
                         Type : Type,
                         Tva : Tva,
                          Created_at: new Date(),
                        },
                      });
                      return { success: true, product: newProduit };
                    } catch (error) {
                      console.error(error);
                      throw error;
                    }
                  }
                  
          static async getallProduit() {
                    try {
                    const allProduit = await prisma.product.findMany();
                    return allProduit;
                    } catch (error) {
                    console.error(error);
                    throw error;
                    }
                    }


        static async deleteProduit(ProductID) {
          try {
            const deletedProduit = await prisma.product.delete({
              where: {
                ProductID: parseInt(ProductID),
              },
            });
            return deletedProduit;
          } catch (error) {
            console.error(error);
            throw error;
          }
        }
                    

}

module.exports = ProduitModel;
