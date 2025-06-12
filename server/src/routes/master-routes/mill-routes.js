const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const millController = require("../../controllers/master-controllers/mill-controllers"); // adjust if filename is different

// Get All Mills
router.get("/", millController.getAllMills);

// Get Mill by Id
router.get("/:millId", millController.getMillById);

// Create New Mill
router.post(
  "/",
  [
    check("millName").not().isEmpty().withMessage("Mill Name is required"),
    body("bank.bankName").notEmpty().withMessage("Bank Name is required"),
    body("bank.accountNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  millController.createMill
);

// Update Mill
router.patch(
  "/:millId",
  [
    check("millName").not().isEmpty().withMessage("Mill Name is required"),
    body("bank.bankName").notEmpty().withMessage("Bank Name is required"),
    body("bank.accountNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  millController.updatedMill
);

// Delete Mill By Id
router.delete("/:millId", millController.deleteMill);

module.exports = router;
