const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../fonts/Roboto-Bold.ttf"),
    italics: path.join(__dirname, "../../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../fonts/Roboto-BoldItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

exports.generateSamplePdf = async (req, res) => {
  const docDefinition = {
    content: [
      { text: "📄 Hello from Shree Mega ERP!", style: "header" },
      {
        text: "This is your first PDF generated from backend 🚀.",
        margin: [0, 10],
      },
      { text: "Feel free to build amazing documents now!", italics: true },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Accumulate chunks of the PDF as it streams
  const chunks = [];
  pdfDoc.on("data", (chunk) => chunks.push(chunk));
  pdfDoc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
    res.send(pdfBuffer);
  });

  pdfDoc.end(); // End the document stream
};
