const express = require("express");
const router = express.Router();
const neftRequestController = require("../../controllers/neft/neft-request.controller");

router.post("/create-new-neft", neftRequestController.createNeftRequest);
router.get("/", neftRequestController.getAllNeftRequests);
router.get("/:id", neftRequestController.getSingleNeftRequest);
router.patch("/:id/status", neftRequestController.updateNeftStatus);
// router.delete("/:id", neftRequestController.deleteNeftRequest); // optional

module.exports = router;
