// 📦 Import Dependencies
const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

// 🧠 Import Controller
const agentsController = require("../../controllers/master/agent.controller");

// Get All Agents
router.get("/", agentsController.getAllAgents);

// Get Agent by Id
router.get("/:agtId", agentsController.getAgentById);

//Create New Agent
router.post(
  "/",
  [
    check("agentName").not().isEmpty(),
    check("type").not().isEmpty(),
    body("bank.bankName").notEmpty().withMessage("Bank Name is Required"),
    body("bank.accNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  agentsController.createAgent
);

//Update Agent
router.patch(
  "/:agtId",
  [
    check("agentName").not().isEmpty(),
    check("type").not().isEmpty(),
    body("bank.bankName").notEmpty().withMessage("Bank Name is Required"),
    body("bank.accNo")
      .isLength({ min: 10, max: 16 })
      .withMessage("Account number must be 10 to 16 digits")
      .matches(/^\d+$/)
      .withMessage("Account number must contain only digits"),
    body("bank.ifsc")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
      .withMessage("Invalid IFSC format"),
  ],
  agentsController.updatedAgent
);

// Delete Agent By Id
router.delete("/:agtId", agentsController.deleteAgentById);

module.exports = router;
