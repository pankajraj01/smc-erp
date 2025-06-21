const express = require("express");
const router = express.Router();
const neftRequestController = require("../../controllers/neft/neft-request.controller");

router.post("/create", neftRequestController.createNeftRequest); // Create a new NEFT request
router.get("/", neftRequestController.getAllNeftRequests); // Get all NEFT requests
router.get("/:id", neftRequestController.getSingleNeftRequest); // Get single NEFT request by ID
router.post("/:neftId/add-party", neftRequestController.addPartyToNeft); // Add party to NEFT request
router.put("/:neftId/party/:partyId", neftRequestController.updatePartyInNeft); // Update party in NEFT request

// Delete party from NEFT request
router.delete(
  "/:neftId/party/:partyId",
  neftRequestController.deletePartyFromNeft
);

// PATCH: Update NEFT status
router.patch("/:neftId/status", neftRequestController.updateNeftStatus);

// PATCH: Update Party NEFT status
router.patch(
  "/:neftId/party/:partyId/status",
  neftRequestController.updatePartyStatus
);

module.exports = router;
