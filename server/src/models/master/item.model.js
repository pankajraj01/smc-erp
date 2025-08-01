// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  itemName: { type: String, required: true, unique: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Item", ItemSchema);
