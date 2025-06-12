const mongoose = require("mongoose");

const bankSchema = require("./bank");

const Schema = mongoose.Schema;

const agentsSchema = Schema(
  {
    agentName: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    bank: { type: bankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agents", agentsSchema);
