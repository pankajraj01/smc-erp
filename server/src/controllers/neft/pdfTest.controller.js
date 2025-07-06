const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const NeftModel = require("../../models/neft/neftRequest.model");

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../fonts/Roboto-Bold.ttf"),
    italics: path.join(__dirname, "../../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../fonts/Roboto-BoldItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

function generatePartyCard(p, i) {
  const bills = p.bills || [];

  return {
    table: {
      widths: ["100%"],
      body: [
        [
          {
            stack: [
              { text: `${p.partyName}`, style: "partyName" },
              {
                columns: [
                  {
                    width: "50%",
                    stack: [
                      { text: `Bank: ${p.bank.bankName}`, margin: [0, 2] },
                      { text: `A/C No: ${p.bank.accNo}`, margin: [0, 2] },
                      { text: `IFSC: ${p.bank.ifsc}`, margin: [0, 2] },
                    ],
                  },
                  {
                    width: "50%",
                    stack: p.partyRemark
                      ? [
                          {
                            text: `Remark:\n${p.partyRemark}`,
                            italics: true,
                            color: "#37474F",
                            fontSize: 9,
                            margin: [0, 2, 0, 0],
                          },
                        ]
                      : [],
                    alignment: "right",
                  },
                ],
              },
              {
                margin: [0, 6, 0, 4],
                table: {
                  headerRows: 1,
                  widths: ["auto", "*", "*", "*", "*", "*", "*", "*"],
                  body: [
                    [
                      "Sr.",
                      "Bill No",
                      "Date",
                      "Amount",
                      "Discount",
                      "RD",
                      "TDS",
                      "Net",
                    ].map((h) => ({
                      text: h,
                      bold: true,
                      fillColor: "#1976D2",
                      color: "white",
                      alignment: "center",
                    })),
                    ...bills.map((b, index) => [
                      { text: index + 1, alignment: "center" }, // ✅ Serial No
                      b.billNo || "",
                      b.billDate
                        ? new Date(b.billDate).toLocaleDateString()
                        : "",
                      { text: b.billAmount || 0, alignment: "right" },
                      { text: b.discount || 0, alignment: "right" },
                      { text: b.rd || 0, alignment: "right" },
                      { text: b.tds || 0, alignment: "right" },
                      {
                        text: b.netAmount || 0,
                        alignment: "right",
                        color: "#2E7D32",
                        bold: true,
                      },
                    ]),
                  ],
                },
                layout: {
                  fillColor: (rowIndex) =>
                    rowIndex % 2 === 0 ? null : "#FAFAFA",
                  hLineWidth: () => 0.5,
                  vLineWidth: () => 0.5,
                  paddingLeft: () => 8,
                  paddingRight: () => 8,
                  paddingTop: () => 4,
                  paddingBottom: () => 4,
                },
              },
              {
                text: `Party Total: ₹${p.totalPartyNeftAmount || 0}`,
                alignment: "right",
                bold: true,
                color: "#1B5E20",
                fontSize: 13,
                margin: [0, 6, 0, 0],
              },
            ],
          },
        ],
      ],
    },
    layout: {
      fillColor: () => "#F1F8E9",
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 12,
      paddingRight: () => 12,
      paddingTop: () => 10,
      paddingBottom: () => 10,
    },
    margin: [0, 0, 0, 20],
  };
}

exports.generatePartyPdf = async (req, res) => {
  try {
    const { neftId, partyId } = req.params;
    const neft = await NeftModel.findById(neftId).populate("parties.partyId");

    if (!neft) return res.status(404).send({ error: "NEFT not found" });

    const firmHeader = {
      table: {
        widths: ["100%"],
        body: [
          [
            {
              fillColor: "#0D47A1",
              color: "white",
              text: "SHREE MEGA CREATION",
              alignment: "center",
              fontSize: 20,
              bold: true,
              margin: [0, 6, 0, 2],
            },
          ],
          [
            {
              text: "UG-19, Raghuvir Trader Center, Near Landmark Empire, Saroli, Surat - 395010",
              alignment: "center",
              fontSize: 10,
              color: "#000000",
              margin: [0, 2, 0, 0],
            },
          ],
          [
            {
              text: "Contact: +91 90014 93631 | Email:shreemegafabtex205@gmail.com",
              alignment: "center",
              fontSize: 10,
              color: "#000000",
              margin: [0, 0, 0, 10],
            },
          ],
        ],
      },
      layout: "noBorders",
    };

    const headerBox = {
      table: {
        widths: ["33%", "33%", "34%"],
        body: [
          [
            { text: `NEFT No:\n#${neft.neftNo}`, style: "labelBold" },
            {
              text: `Date:\n${new Date(neft.neftDate).toLocaleDateString()}`,
              style: "labelBold",
            },
            {
              text: `Generated: ${new Date().toLocaleString()}`,
              fontSize: 8,
              alignment: "right",
              color: "#888",
            },
          ],
          ...(partyId
            ? [] // 🚫 Don't show Neft remark when party PDF
            : [
                [
                  {
                    text: neft.neftRemark
                      ? `Neft Remark:\n${neft.neftRemark}`
                      : "",
                    style: "labelBold",
                    colSpan: 3,
                  },
                  {},
                  {},
                ],
              ]),
        ],
      },
      layout: {
        fillColor: () => "#E3F2FD",
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 10,
        paddingBottom: () => 10,
      },
      margin: [0, 0, 0, 20],
    };

    let partySections = [];
    let selected = null;

    if (partyId) {
      selected = neft.parties.find((p) => {
        const id =
          typeof p.partyId === "object" && p.partyId !== null
            ? p.partyId._id?.toString()
            : p.partyId?.toString();
        return id === partyId;
      });

      if (!selected)
        return res.status(404).send({ error: "Party not found in this NEFT" });

      partySections.push(generatePartyCard(selected, 0));
    } else {
      partySections = neft.parties.map((p, i) => generatePartyCard(p, i));
    }

    const docDefinition = {
      content: [
        firmHeader,
        headerBox,
        ...partySections,
        // ✅ Branding: Always show
        {
          ...(partyId
            ? {}
            : {
                text: `GRAND NEFT AMOUNT: ₹${neft.neftAmount}`,
                alignment: "right",
                style: "totalFinal",
                margin: [0, 10, 0, 20],
              }),
        },
        {
          table: {
            widths: ["100%"],
            body: [
              [
                {
                  text: `Built with Love by Pankaj Rajpurohit\nIT Solutions • ERP Systems • Custom Software`,
                  alignment: "center",
                  fontSize: 9,
                  color: "#666",
                  margin: [0, 4],
                },
              ],
              [
                {
                  text: ` +91-90014-93631   |   pankajrajpurohit.com   |    contact@pankajrajpurohit.com`,
                  alignment: "center",
                  fontSize: 8,
                  color: "#999",
                  margin: [0, 0, 0, 8],
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      styles: {
        labelBold: { fontSize: 12, bold: true, color: "#0D47A1" },
        partyName: {
          fontSize: 14,
          bold: true,
          color: "#1B5E20",
          margin: [0, 4, 0, 4],
        },
        totalFinal: {
          fontSize: 15,
          bold: true,
          color: "#4A148C",
        },
      },
      defaultStyle: {
        font: "Roboto",
        fontSize: 9,
      },
    };

    const fileName = partyId
      ? `Neft-${neft.neftNo}-${selected.partyName.replace(/\s+/g, "_")}.pdf`
      : `Neft-${neft.neftNo}.pdf`;

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
      res.send(pdfBuffer);
    });
    pdfDoc.end();
  } catch (err) {
    console.error("❌ PDF Generation Error:", err);
    res.status(500).send({ error: "Failed to generate PDF" });
  }
};
