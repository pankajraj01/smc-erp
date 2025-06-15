// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model
const bankSchema = require("./bank.model");

const agentsSchema = Schema(
  {
    agentName: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    bank: { type: bankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agents", agentsSchema);
