// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model
const bankSchema = require("./bank.model");

const millSchema = Schema(
  {
    millName: { type: String, required: true, unique: true },
    bank: { type: bankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mill", millSchema);
