const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const partyController = require("../../controllers/master-controllers/party-controllers");

// Get All Parties
router.get("/", partyController.getAllParties);

// Get Party by Id
router.get("/:ptyId", partyController.getPartyById);

//Create New Agent
router.post(
  "/",
  [
    check("partyName").not().isEmpty(),
    check("type").not().isEmpty(),
    body("bank.bankName").notEmpty().withMessage("Bank Name is Required"),
    body("bank.accountNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  partyController.createParty
);

//Update Party
router.patch(
  "/:ptyId",
  [
    check("partyName").not().isEmpty(),
    check("type").not().isEmpty(),
    body("bank.bankName").notEmpty().withMessage("Bank Name is Required"),
    body("bank.accountNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  partyController.updatedParty
);

// Delete Agent By Id
router.delete("/:ptyId", partyController.deleteParty);

module.exports = router;
