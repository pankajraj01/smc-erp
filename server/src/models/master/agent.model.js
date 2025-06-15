// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model
const BankSchema = require("./bank.model");

const AgentsSchema = Schema(
  {
    agentName: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    bank: { type: BankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", AgentsSchema);
