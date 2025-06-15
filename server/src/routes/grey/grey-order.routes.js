// 📦 Import Dependencies
const express = require("express");

// 🧠 Import Middleware and Controllers
const validateGreyOrder = require("../../middleware/validate-grey-order.middleware");
const greyOrderController = require("../../controllers/grey/grey-order.controller");

const router = express.Router();

// Get all grey orders
router.get("/", greyOrderController.getAllGreyOrders);

// Get a single grey order by ID
router.get("/:orderId", greyOrderController.getGreyOrderById);

// Create a new grey order
router.post("/", validateGreyOrder, greyOrderController.createGreyOrder);

// Update a grey order by ID
router.put("/:orderId", validateGreyOrder, greyOrderController.updateGreyOrder);

// Delete a grey order by ID
router.delete("/:orderId", greyOrderController.deleteGreyOrder);

module.exports = router;
