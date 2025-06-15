// 📦 Import Dependencies
const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

// 🧠 Import Controller
const itemControllers = require("../../controllers/master/item.controller");

router.get("/", itemControllers.getAllItems);

router.post(
  "/",
  [check("itemName").not().isEmpty(), check("type").not().isEmpty()],
  itemControllers.createItem
);

router.patch(
  "/:itmId",
  [
    check("itemName").optional().not().isEmpty(),
    check("type").optional().not().isEmpty(),
  ],
  itemControllers.updatedItem
);

router.delete("/:itmId", itemControllers.deleteItem);

module.exports = router;
