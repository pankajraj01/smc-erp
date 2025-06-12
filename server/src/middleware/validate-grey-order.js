const { check, body } = require("express-validator");

const validateGreyOrder = [
  //   check("orderNo").notEmpty().withMessage("Order number is required"),

  check("agentName").notEmpty().withMessage("Agent name is required"),

  check("itemName").notEmpty().withMessage("Item name is required"),

  check("rate")
    .notEmpty()
    .withMessage("Rate is required")
    .isNumeric()
    .withMessage("Rate must be a number"),

  check("than").optional().isNumeric().withMessage("Than must be a number"),

  check("orderDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Order date must be a valid date"),
];

module.exports = validateGreyOrder;
