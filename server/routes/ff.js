const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ffRouter = express.Router();

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = '../pdfs'; // Folder where you want to save the PDFs
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = `Invoice_${req.params.invoiceNumber}.pdf`; // Use invoice number as filename
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Route to handle PDF saving
ffRouter.post('/api/v1/saveInvoicePdf/:invoiceNumber', upload.single('file'), (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber; // Get the invoice number from params
    res.status(200).json({ 
      success: true, 
      message: 'PDF saved successfully!', 
      invoiceNumber: invoiceNumber  // Return the invoice number
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saving PDF.', 
      error 
    });
  }
});

module.exports = ffRouter;
