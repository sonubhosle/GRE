const PDFDocument = require('pdfkit');

const generateCertificate = (userName, courseName, completionDate) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Background
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f0e17');

        // Border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .lineWidth(3)
            .stroke('#6366f1');

        // Title
        doc.fillColor('#ffffff')
            .font('Helvetica-Bold')
            .fontSize(48)
            .text('CERTIFICATE OF COMPLETION', 0, 80, { align: 'center' });

        // Subtitle line
        doc.moveTo(100, 160).lineTo(doc.page.width - 100, 160).stroke('#6366f1');

        // Body text
        doc.fillColor('#a5b4fc')
            .font('Helvetica')
            .fontSize(18)
            .text('This is to certify that', 0, 190, { align: 'center' });

        doc.fillColor('#ffffff')
            .font('Helvetica-Bold')
            .fontSize(36)
            .text(userName, 0, 230, { align: 'center' });

        doc.fillColor('#a5b4fc')
            .font('Helvetica')
            .fontSize(18)
            .text('has successfully completed the course', 0, 290, { align: 'center' });

        doc.fillColor('#fbbf24')
            .font('Helvetica-Bold')
            .fontSize(28)
            .text(courseName, 0, 330, { align: 'center' });

        // Bottom line
        doc.moveTo(100, 400).lineTo(doc.page.width - 100, 400).stroke('#6366f1');

        doc.fillColor('#6b7280')
            .font('Helvetica')
            .fontSize(14)
            .text(`Date of Completion: ${new Date(completionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, 420, { align: 'center' });

        doc.fillColor('#6366f1')
            .font('Helvetica-Bold')
            .fontSize(20)
            .text('EduPlatform', 0, 460, { align: 'center' });

        doc.end();
    });
};

module.exports = { generateCertificate };
