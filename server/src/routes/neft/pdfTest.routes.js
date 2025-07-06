const express = require("express");
const router = express.Router();
const {
  generatePartyPdf,
} = require("../../controllers/neft/pdfTest.controller");

// Full NEFT PDF
router.get("/:neftId/pdf", generatePartyPdf);

// Single Party PDF
router.get("/:neftId/party/:partyId/pdf", generatePartyPdf);

module.exports = router;
