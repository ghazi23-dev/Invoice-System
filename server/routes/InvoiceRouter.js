const express = require('express');
const InvoiceRouter = express.Router();

const InvoiceController = require('../controllers/InvoiceController');
const authenticateToken = require('../middleware/middleware');


InvoiceRouter.post('/api/v1/createInvoice', InvoiceController.createInvoice);
InvoiceRouter.get('/api/v1/getInvoiceByID/:InvoiceID', InvoiceController.getInvoiceByID);
InvoiceRouter.get('/api/v1/getInvoices', InvoiceController.getInvoices);








module.exports = InvoiceRouter;