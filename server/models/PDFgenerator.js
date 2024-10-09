const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

async function generateInvoicePDF(data, fileName) {
  try {
    const invoicesDir = path.join(__dirname, 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    // Path to the Handlebars template
    const templatePath = path.join(__dirname, 'espace_amicale', 'index.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // Compile the Handlebars template
    const template = Handlebars.compile(templateSource);

    // Read multiple CSS files and concatenate them
    const cssFiles = ['style.css', 'styles.min.css']; // Add your CSS file names here
    let cssContent = '';
    cssFiles.forEach(file => {
      const cssPath = path.join(__dirname, 'espace_amicale', file);
      cssContent += fs.readFileSync(cssPath, 'utf-8') + '\n';
    });

    const ressourceLogo = ['logo.jpeg']; // Add your CSS file names here
          let logoContent = '';
          ressourceLogo.forEach(file => {
            const logoPath = path.join(__dirname, 'espace_amicale', file);
            logoContent += fs.readFileSync(logoPath, 'utf-8') + '\n';
          });

    // Generate the HTML content
    const htmlContent = template(data);

    // Embed the concatenated CSS into the HTML content
    const fullHtmlContent = `
      <html>
        <head>
          <style>${cssContent}</style>
          
        </head>
    
        <body>
            <style>${logoContent}</style>
          ${htmlContent}
        </body>
      </html>
    `;

    // PDF output path
    const pdfPath = path.join(invoicesDir, `${fileName}.pdf`);

    // Launch Puppeteer and create PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    console.log('PDF generated successfully:', pdfPath);
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

module.exports = generateInvoicePDF;
