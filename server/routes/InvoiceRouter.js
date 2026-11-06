const express = require('express');
const InvoiceRouter = express.Router();

const InvoiceController = require('../controllers/InvoiceController');
const authenticateToken = require('../middleware/middleware');


InvoiceRouter.post('/api/v1/createInvoice', authenticateToken,InvoiceController.createInvoice);
InvoiceRouter.get('/api/v1/getInvoiceByID/:InvoiceID', authenticateToken,InvoiceController.getInvoiceByID);
InvoiceRouter.get('/api/v1/getInvoices', authenticateToken,InvoiceController.getInvoices);

InvoiceRouter.get('/api/v1/getLastInvoiceNumber',InvoiceController.getLastInvoiceNumber);
InvoiceRouter.delete('/api/v1/deleteInvoice/:InvoiceID', InvoiceController.DeleteInvoice);


InvoiceRouter.post('/api/v1/create-credit-invoice', InvoiceController.createCreditInvoice);




module.exports = InvoiceRouter;