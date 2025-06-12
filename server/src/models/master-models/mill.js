const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bankSchema = require("./bank");

const millSchema = Schema(
  {
    millName: { type: String, required: true, unique: true },
    bank: { type: bankSchema, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mill", millSchema);
