// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model
const BankSchema = require("./bank.model");

const MillSchema = Schema(
  {
    millName: { type: String, required: true, unique: true },
    bank: { type: BankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mill", MillSchema);
