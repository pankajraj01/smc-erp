const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bankSchema = require("./bank");

const partySchema = Schema(
  {
    partyName: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    bank: { type: bankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parties", partySchema);
