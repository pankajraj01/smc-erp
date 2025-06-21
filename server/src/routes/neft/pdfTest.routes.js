const express = require("express");
const router = express.Router();
const {
  generateSamplePdf,
} = require("../../controllers/neft/pdfTest.controller");

router.get("/sample", generateSamplePdf);

module.exports = router;
