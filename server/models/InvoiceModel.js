const { PrismaClient } = require("@prisma/client");

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
            create: data.Items.map((item) => ({
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
            })),
          },
        },
        include: {
          Items: true,
        },
      });
      return invoice;
    } catch (error) {
      throw error;
    }
  }

  // static async createCreditInvoice(data) {
  //   try {
  //     // Fetch the original invoice and its items
  //     const originalInvoice = await prisma.invoice.findUnique({
  //       where: { InvoiceID: data.originalInvoiceID },
  //       include: { Items: true }, // Include the items from the original invoice
  //     });
  
  //     if (!originalInvoice) {
  //       throw new Error('Original invoice not found');
  //     }

  //     // Check if a credit invoice (Avoir) already exists for this invoice
  //     const existingCreditInvoice = await prisma.invoice.findFirst({
  //       where: {
  //         ReferencedInvoiceID: data.originalInvoiceID,
  //         InvoiceType: 'Avoir'
  //       }
  //     });

  //     if (existingCreditInvoice) {
  //       throw new Error(`Une facture d'avoir existe déjà pour cette facture ${originalInvoice.invoiceNumber}`);
  //     }
  
  //     // Get the current year and month for the invoice number
  //     const date = new Date();
  //     const year = date.getFullYear();
  //     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
  
  //     // Get the count of invoices already created in the current month
  //     const existingInvoices = await prisma.invoice.count({
  //       where: {
  //         invoiceNumber: {
  //           startsWith: `AV-${year}${month}`, // Filter invoices created in the current month
  //         },
  //       },
  //     });
  
  //     // The next sequential number will be the count of invoices + 1 (padded to 3 digits)
  //     const sequenceNumber = (existingInvoices + 1).toString().padStart(3, '0');
  
  //     // Generate the invoice number in the format AV-YYYYMM-XXX
  //     const invoiceNumber = `AV-${year}${month}-${sequenceNumber}`;
  
  //     // Create the credit invoice
  //     const creditInvoice = await prisma.invoice.create({
  //       data: {
  //         invoiceNumber, // Generated invoice number
  //         customerName: originalInvoice.customerName,
  //         InvoiceDate: new Date().toISOString(),
  //         dueDate: new Date(originalInvoice.dueDate).toISOString(),
  //         Status: 'Pending', // You can set this to the appropriate status
  //         referenceNumber: `CR-${originalInvoice.invoiceNumber}`, // Reference number based on the original invoice
  //         ReferencedInvoiceID: originalInvoice.InvoiceID, // Link to the original invoice
  //         InvoiceType: 'Avoir', // Mark it as a credit invoice
  //         DescriptionProduct: originalInvoice.DescriptionProduct,
  //         TotalHT: originalInvoice.TotalHT, // Negate the total amounts for the credit
  //         Discount: originalInvoice.Discount,
  //         Tva: originalInvoice.Tva,
  //         Timbre_Fiscal: originalInvoice.Timbre_Fiscal,
  //         TotalAmount: originalInvoice.TotalAmount, // Negate the total amounts for the credit
  //         clientId: originalInvoice.clientId,
  //         Items: {
  //           create: originalInvoice.Items.map((item) => ({
  //             ProductID: item.ProductID,
  //             Description: item.Description,
  //             Quantity: item.Quantity, // Negate the quantities for credit
  //             DiscountType: item.DiscountType,
  //             DiscountValue: item.DiscountValue,
  //             Tax: item.Tax,
  //             TotalTTC: item.TotalTTC, // Negate the totals for credit
  //             Notes: item.Notes,
  //             Terms: item.Terms,
  //             SignatureName: item.SignatureName,
  //             Discount: item.Discount,
  //             Rate: item.Rate,
  //             Amount: item.Amount, // Negate the amounts for credit
  //             Montant_Achat: item.Montant_Achat,
  //             Montant_Debourser: item.Montant_Debourser,
  //           })),
  //         },
  //       },
  //       include: {
  //         Items: true,
  //       },
  //     });
  
  //     return creditInvoice;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  
  static async createCreditInvoice(data) {
    try {
        // Fetch the original invoice and its items
        const originalInvoice = await prisma.invoice.findUnique({
            where: { InvoiceID: data.originalInvoiceID },
            include: { Items: true },
        });

        if (!originalInvoice) {
            throw new Error('Original invoice not found');
        }

        // Check if a credit invoice (Avoir) already exists for this invoice
        const existingCreditInvoice = await prisma.invoice.findFirst({
            where: {
                ReferencedInvoiceID: data.originalInvoiceID,
                InvoiceType: 'Avoir',
            }
        });

        if (existingCreditInvoice) {
            throw new Error(`Une facture d'avoir existe déjà pour cette facture ${originalInvoice.invoiceNumber}`);
        }

        // Get the current year
        const date = new Date();
        const year = date.getFullYear();

        // Find the latest credit invoice (Avoir) for this year
        const lastInvoice = await prisma.invoice.findFirst({
            where: {
                invoiceNumber: {
                    startsWith: `AV-${year}-`, // Check invoices from the same year
                },
            },
            orderBy: {
                invoiceNumber: 'desc',
            },
        });

        // Determine the next sequence number
        let sequenceNumber = '001'; // Default if no previous invoices exist
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
            sequenceNumber = (lastSequence + 1).toString().padStart(3, '0');
        }

        // Generate the invoice number in the format AV-YYYY-XXX
        const invoiceNumber = `AV-${year}-${sequenceNumber}`;

        // Create the credit invoice
        const creditInvoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                customerName: originalInvoice.customerName,
                InvoiceDate: new Date().toISOString(),
                dueDate: new Date(originalInvoice.dueDate).toISOString(),
                Status: 'Pending',
                referenceNumber: `CR-${originalInvoice.invoiceNumber}`,
                ReferencedInvoiceID: originalInvoice.InvoiceID,
                InvoiceType: 'Avoir',
                DescriptionProduct: originalInvoice.DescriptionProduct,
                TotalHT: originalInvoice.TotalHT,
                Discount: originalInvoice.Discount,
                Tva: originalInvoice.Tva,
                Timbre_Fiscal: originalInvoice.Timbre_Fiscal,
                TotalAmount: originalInvoice.TotalAmount,
                clientId: originalInvoice.clientId,
                Items: {
                    create: originalInvoice.Items.map((item) => ({
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
                        Montant_Achat: item.Montant_Achat,
                        Montant_Debourser: item.Montant_Debourser,
                    })),
                },
            },
            include: {
                Items: true,
            },
        });

        return creditInvoice;
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
        throw new Error("Invoice not found");
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

  static async getLastInvoiceNumber() {
    try {
      const currentYear = new Date().getFullYear(); // Get the current year dynamically
  
      const invoice = await prisma.invoice.findFirst({
        where: {
          InvoiceType: "Facture", // Filter only for invoices of type 'Facture'
        },
        orderBy: {
          InvoiceID: "desc", // Order by descending ID to get the latest invoice
        },
      });
  
      if (!invoice) {
        // Start the numbering if no invoice exists with type 'Facture'
        return `FA${currentYear}-001`;
      }
  
      // Extract the last invoice number
      const lastInvoiceNumber = invoice.invoiceNumber;
  
      // Extract the numeric part (after the dash)
      const parts = lastInvoiceNumber.split('-');
      const lastYear = parts[0].substring(2); // Extract year from 'FA2024'
      const number = parseInt(parts[1], 10);
  
      // If the last invoice belongs to a previous year, reset the counter
      if (parseInt(lastYear) !== currentYear) {
        return `FA${currentYear}-001`;
      }
  
      // Increment the number for the new invoice
      const newInvoiceNumber = number + 1;
  
      // Format the number with leading zeros (e.g., 226 -> 227, 001 -> 002)
      const formattedNumber = String(newInvoiceNumber).padStart(3, '0');
  
      // Return the new invoice number with the correct year
      return `FA${currentYear}-${formattedNumber}`;
    } catch (error) {
      throw error;
    }
  }
  
  
  // static async getLastInvoiceNumber() {
  //   try {
  //     // Fetch all invoice numbers for type 'Facture' and extract the numeric parts
  //     const invoices = await prisma.invoice.findMany({
  //       where: {
  //         InvoiceType: "Facture", // Filter only for invoices of type 'Facture'
  //       },
  //       select: {
  //         invoiceNumber: true, // Only fetch the invoiceNumber field
  //       },
  //     });
  
  //     if (!invoices || invoices.length === 0) {
  //       // Start the numbering if no invoice exists with type 'Facture'
  //       return 'FA2023-001';
  //     }
  
  //     // Extract the numeric part from each invoiceNumber and find the max value
  //     const maxNumber = Math.max(
  //       ...invoices.map((invoice) => {
  //         const parts = invoice.invoiceNumber.split('-');
  //         return parseInt(parts[1], 10); // Extract and parse the numeric part
  //       })
  //     );
  
  //     // Increment the max number for the new invoice
  //     const newInvoiceNumber = maxNumber + 1;
  
  //     // Format the number with leading zeros (e.g., 226 -> 227, 001 -> 002)
  //     const formattedNumber = String(newInvoiceNumber).padStart(3, '0');
  
  //     // Return the new invoice number with the same prefix
  //     return `FA2023-${formattedNumber}`;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  

  static async DeleteInvoice(InvoiceID) {
    try {
      // Optionally, first delete related records (like items)
      await prisma.invoiceItems.deleteMany({
        where: {
          InvoiceID: parseInt(InvoiceID), // Assuming invoiceItem has an invoiceId foreign key
        },
      });
  
      // Now delete the invoice
      const invoice = await prisma.invoice.delete({
        where: {
          InvoiceID: parseInt(InvoiceID),
        },
      });
      return invoice;
    } catch (error) {
      throw error;
    }
  }
  
  

}

module.exports = InvoiceModel;
