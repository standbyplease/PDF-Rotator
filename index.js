const axios = require('axios');
const express = require('express');
const { PDFDocument, degrees } = require('pdf-lib');

const app = express();
const port = 3000;

app.get('/rotate-pdf', async (req, res) => {
    try {
        const pdfUrl = req.query.url;

        if (!pdfUrl) {
            return res.status(400).send('Missing URL. Use ?url=https://yourpdf.com/document.pdf');
        }

        // Fetch the original PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBytes = response.data;

        // Load and rotate the PDF
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.getPages().forEach(page => {
            page.setRotation(degrees(90));
        });

        const rotatedPdfBytes = await pdfDoc.save();

        // Send the rotated PDF
        res.contentType('application/pdf');
        res.send(Buffer.from(rotatedPdfBytes));

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing the PDF: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`PDF rotation server running at ${port}`);
});
