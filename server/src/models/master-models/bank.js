const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bankSchema = Schema({
  bankName: { type: String, required: true },
  accountNo: { type: String, required: true },
  ifsc: { type: String, required: true },
});

module.exports = bankSchema;
