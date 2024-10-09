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
      const invoice = await prisma.invoice.findFirst({
        orderBy: {
          InvoiceID: "desc",
        },
      });
  
      if (!invoice) {
        // Start the numbering if no invoice exists
        return 'FA2023-001';
      }
  
      // Extract the last invoice number
      const lastInvoiceNumber = invoice.invoiceNumber;
  
      // Extract the numeric part (after the dash)
      const parts = lastInvoiceNumber.split('-');
      const number = parseInt(parts[1], 10);
  
      // Increment the number for the new invoice
      const newInvoiceNumber = number + 1;
  
      // Format the number with leading zeros (e.g., 226 -> 227, 001 -> 002)
      const formattedNumber = String(newInvoiceNumber).padStart(3, '0');
  
      // Return the new invoice number with the same prefix
      return `FA2023-${formattedNumber}`;
    } catch (error) {
      throw error;
    }
  }

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
