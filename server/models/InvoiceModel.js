const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

class InvoiceModel {

      
          static async createInvoice(data) {
                    try {
                      const invoice = await prisma.invoice.create({
                        data: {
                          invoiceNumber: data.invoiceNumber,
                          customerName: data.customerName,
                          InvoiceDate: new Date(data.InvoiceDate).toISOString(),
                          dueDate: new Date(data.dueDate).toISOString(), // Convert to ISO 8601 format
                          Status: data.Status,
                          referenceNumber: data.referenceNumber,
                          DescriptionProduct: data.DescriptionProduct,
                          TotalHT: data.TotalHT,
                          Discount: data.Discount,
                          Tva: data.Tva,
                          Timbre_Fiscal: data.Timbre_Fiscal,
                          TotalAmount: data.TotalAmount,
                          clientId: data.clientId,
                          Items: {
                            create: data.Items.map(item => ({
                              ProductID: item.ProductID,
                              Description: item.Description,
                              Quantity: item.Quantity,
                              DiscountType: item.DiscountType,
                              DiscountValue: item.DiscountValue,
                              Tax: item.Tax,
                              TotalTTC: item.TotalTTC,
                              Notes: item.Notes,
                              Terms: item.Terms,
                              SignatureName: item.SignatureName,
                              Discount: item.Discount,
                              Rate: item.Rate,
                              Amount: item.Amount,
                              Montant_Achat: item.Montant_Achat, // Include Montant_Achat
                              Montant_Debourser: item.Montant_Debourser, // Include Montant_Debourser
                            }))
                          }
                        },
                        include: {
                          Items: true
                        }
                      });
                      return invoice;
                    } catch (error) {
                      throw error;
                    }
                  }

                  static async getInvoiceByID(InvoiceID) {
                    try {
                      const invoice = await prisma.invoice.findUnique({
                        where: {
                          InvoiceID: parseInt(InvoiceID),
                        },
                        include: {
                          Items: true,
                          client: true,

                        },
                      });
                      
                      if (!invoice) {
                        throw new Error('Invoice not found');
                      }
                
                      return invoice;
                    } catch (error) {
                      throw error;
                    }
                  }

                  static async getInvoices() {
                    try {
                      const invoices = await prisma.invoice.findMany({
                        include: {
                          Items: true,
                          client: true,
                        },
                      });
                      return invoices;
                    } catch (error) {
                      throw error;
                    }
                  }
                }
                  
                  

                    



module.exports = InvoiceModel;
