// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankSchema = Schema({
  bankName: { type: String, required: true },
  accNo: { type: String, required: true },
  ifsc: { type: String, required: true },
});

module.exports = BankSchema;
