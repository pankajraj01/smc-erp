// 📦 Import Dependencies
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

// 🔗 Import Models
const Item = require("../../models/master/item.model");

// ⚙️ Import Services
const HttpError = require("../../utils/httpError");

// Get All Items
const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find();
    res.json({ items: items.map((i) => i.toObject({ getters: true })) });
  } catch (err) {
    next(new HttpError("Failed to fetch items. Please try again later.", 500));
  }
};

// Create Item
const createItem = async (req, res, next) => {
  try {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { itemName, type } = req.body;
    const trimmedName = itemName.trim();

    // 2. Check for existing item
    const exists = await Item.findOne({ itemName: trimmedName });
    if (exists) {
      throw new HttpError("Item with this name already exists.", 422);
    }

    // 3. Create and save item
    const newItem = await new Item({ itemName: trimmedName, type }).save();

    // 4. Respond with created item
    res.status(201).json({ item: newItem.toObject({ getters: true }) });
  } catch (err) {
    // 5. Handle duplicate insert race condition
    if (err.code === 11000) {
      return next(new HttpError("Duplicate item name", 422));
    }

    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Internal server error", 500)
    );
  }
};

// Update Item
const updatedItem = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid input passed, please check your data", 422);
    }

    const { itemName, type } = req.body;
    const itemId = req.params.itmId;

    // 2. Fetch the item
    const item = await Item.findById(itemId);
    if (!item) {
      throw new HttpError("Item not found", 404);
    }

    // 3. Check for duplicate itemName (excluding itself)
    if (itemName && itemName !== item.itemName) {
      const exists = await Item.findOne({ itemName });
      if (exists && exists._id.toString() !== itemId) {
        throw new HttpError("Item with this name already exists", 422);
      }
      item.itemName = itemName.trim();
    }

    // 4. Update other fields
    if (type) item.type = type;

    // 5. Save and respond
    await item.save();
    res.status(200).json({ item: item.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Duplicate item name", 422));
    }
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to update item", 500)
    );
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itmId;
    console.log("Deleting item with ID:", itemId);

    const item = await Item.findById(itemId);
    if (!item) {
      throw new HttpError("Item not found", 404);
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return next(
      err instanceof HttpError
        ? err
        : new HttpError("Failed to delete item", 500)
    );
  }
};

exports.getAllItems = getAllItems;
exports.createItem = createItem;
exports.updatedItem = updatedItem;
exports.deleteItem = deleteItem;
