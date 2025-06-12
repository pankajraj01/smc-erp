const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const itemControllers = require("../../controllers/master-controllers/item-controllers");

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
