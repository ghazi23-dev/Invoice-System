const InvoiceModel = require("../models/InvoiceModel");

class InvoiceController {
  static async createInvoice(req, res) {
    try {
      const data = req.body;
      console.log("Data received in createInvoice controller:", data);

      const invoice = await InvoiceModel.createInvoice(data);
      console.log("Invoice created successfully:", invoice);

      return res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        invoice,
      });
    } catch (error) {
      console.error("Error in createInvoice controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating invoice",
        error: error.message,
      });
    }
  }

  static async createCreditInvoice(req, res) {
    try {
      // Extract the originalInvoiceID from the request body
      const { originalInvoiceID } = req.body;

      if (!originalInvoiceID) {
        return res.status(400).json({
          message: 'Original Invoice ID is required',
        });
      }

      // Call the model method to create the credit invoice
      const creditInvoice = await InvoiceModel.createCreditInvoice({ originalInvoiceID });

      // Ensure the credit invoice was created successfully
      if (!creditInvoice) {
        return res.status(500).json({
          message: 'Error creating credit invoice',
          error: 'Failed to create credit invoice',
        });
      }

      // Send the created credit invoice back as a response
      return res.status(201).json({
        message: 'Credit Invoice created successfully!',
        creditInvoice,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);  // Log the error for debugging
      return res.status(500).json({
        message: 'Error creating credit invoice',
        error: error.message,
      });
    }
  }



  static async getInvoiceByID(req, res) {
    const { InvoiceID } = req.params;
    try {
      const invoice = await InvoiceModel.getInvoiceByID(InvoiceID);
      res.json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.getInvoices();
      res.json(invoices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getLastInvoiceNumber(req, res) {
    try {
      const invoice = await InvoiceModel.getLastInvoiceNumber();
      res.json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async DeleteInvoice(req, res) {
    const { InvoiceID } = req.params;
    try {
      const invoice = await InvoiceModel.DeleteInvoice(InvoiceID);
      res.json(invoice);
    } catch (error) {
      if (error.code === 'P2003') {
        res.status(400).json({ error: "Cannot delete invoice. It has related records." });
      } else {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
  
}

module.exports = InvoiceController;
