const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true, unique: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
