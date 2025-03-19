const axios = require('axios');
const express = require('express');
const { PDFDocument, degrees } = require('pdf-lib');

const app = express();
const port = 3000;

app.get('/rotate-pdf', async (req, res) => {
    try {
        const pdfUrl = req.query.url;
        if (!pdfUrl) return res.status(400).send('Missing URL. Use ?url=https://yourpdf.com/document.pdf');

        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfDoc = await PDFDocument.load(response.data);
        const pages = pdfDoc.getPages();

        if (pages.length >= 2) {
            pages[0].setRotation(degrees(90));
            pages[1].setRotation(degrees(180));
        } else {
            return res.status(400).send('PDF must have at least 2 pages.');
        }

        const rotatedPdfBytes = await pdfDoc.save();
        res.contentType('application/pdf');
        res.send(Buffer.from(rotatedPdfBytes));

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).send('Error processing the PDF: ' + error.message);
    }
});

app.listen(port, () => console.log(`PDF rotation server running at ${port}`));
