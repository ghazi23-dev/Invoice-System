const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ffRouter = express.Router();

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './pdfs'; // Folder where you want to save the PDFs
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

ffRouter.get('/api/v1/listPdfs', (req, res) => {
  const pdfDir = path.join(__dirname, '../pdfs');

  fs.readdir(pdfDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error reading PDF directory.',
        error: err.message
      });
    }

    const pdfList = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        title: file,
        description: `PDF file: ${file}`,
        date: fs.statSync(path.join(pdfDir, file)).mtime.toISOString().split('T')[0], // get the modification date
        fileUrl: `/pdfs/${file}`,
        subject: 'invoice' // You can customize this as per your requirement
      }));

    res.status(200).json({
      success: true,
      pdfs: pdfList
    });
  });
});

module.exports = ffRouter;
