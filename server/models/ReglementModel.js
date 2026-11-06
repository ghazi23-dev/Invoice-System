const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ReglementModel {
  static async getReglements() {
    try {
      const reglements = await prisma.reglement.findMany({
        orderBy: { CreatedAt: "desc" },
        include: {
          Invoice: {
            select: {
              InvoiceID: true,
              invoiceNumber: true,
              customerName: true,
              InvoiceType: true,
              Status: true,
              TotalAmount: true,
            },
          },
        },
      });

      return reglements;
    } catch (error) {
      throw error;
    }
  }

  static async addReglement(data) {
    try {
      const reglement = await prisma.reglement.create({
        data: {
          InvoiceID: parseInt(data.InvoiceID),
          Montant: parseFloat(data.Montant),
          Mode: data.Mode,
          DateReglement: new Date(data.DateReglement),
          Reference: data.Reference || null,
          Notes: data.Notes || null,
        },
        include: {
          Invoice: {
            select: {
              InvoiceID: true,
              invoiceNumber: true,
              customerName: true,
              InvoiceType: true,
              Status: true,
              TotalAmount: true,
            },
          },
        },
      });

      // Recompute the invoice status from the total amount settled so far
      const status = await ReglementModel.updateInvoiceStatus(reglement.InvoiceID);
      reglement.Invoice.Status = status;

      return reglement;
    } catch (error) {
      throw error;
    }
  }

  static async DeleteReglement(ReglementID) {
    try {
      const reglement = await prisma.reglement.delete({
        where: { ReglementID: parseInt(ReglementID) },
      });

      // Recompute the status of the invoice this reglement belonged to
      await ReglementModel.updateInvoiceStatus(reglement.InvoiceID);

      return reglement;
    } catch (error) {
      throw error;
    }
  }

  // Total settled vs invoice total → Paid / Pending / Unpaid
  static async updateInvoiceStatus(InvoiceID) {
    const invoice = await prisma.invoice.findUnique({
      where: { InvoiceID: parseInt(InvoiceID) },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const aggregate = await prisma.reglement.aggregate({
      _sum: { Montant: true },
      where: { InvoiceID: parseInt(InvoiceID) },
    });

    const paid = Number(aggregate._sum.Montant || 0);
    const total = Number(invoice.TotalAmount);

    let status = "Unpaid";
    if (total > 0 && paid >= total) {
      status = "Paid";
    } else if (paid > 0) {
      status = "Pending";
    }

    if (invoice.Status !== status) {
      await prisma.invoice.update({
        where: { InvoiceID: parseInt(InvoiceID) },
        data: { Status: status },
      });
    }

    return status;
  }
}

module.exports = ReglementModel;
