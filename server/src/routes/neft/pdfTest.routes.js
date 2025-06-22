const express = require("express");
const router = express.Router();
const {
  generatePartyPdf,
} = require("../../controllers/neft/pdfTest.controller");

// Full NEFT PDF
router.get("/:neftId", generatePartyPdf);

// Single Party PDF
router.get("/:neftId/party/:partyId", generatePartyPdf);

module.exports = router;
