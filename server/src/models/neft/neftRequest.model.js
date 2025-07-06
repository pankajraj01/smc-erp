// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model
const BankSchema = require("../master/bank.model");

// 🔹 Bill Schema
const BillSchema = Schema({
  billNo: { type: String, required: true },
  billDate: { type: Date, required: true },
  billAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rd: { type: Number, default: 0 },
  tds: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
});

// 🔹 Party NEFT Schema
const PartyNeftSchema = Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },
  partyName: { type: String, required: true },
  bank: { type: BankSchema, required: true },
  partyNeftStatus: {
    type: String,
    enum: ["Pending", "Sent", "Partial", "Paid", "Cancelled"],
    default: "Pending",
  },
  tdsTotal: { type: Number, default: 0 },
  totalPartyNeftAmount: { type: Number, required: true },
  partyRemark: { type: String, default: "-" },
  bills: { type: [BillSchema], default: [] },
});

// 🔹 Party NEFT Schema
const NeftRequestSchema = Schema(
  {
    neftNo: { type: Number, required: true, unique: true },
    neftDate: { type: Date, default: Date.now },
    neftAmount: { type: Number, required: true },
    neftStatus: {
      type: String,
      enum: ["Pending", "Sent", "Partial", "Paid", "Cancelled"],
      default: "Pending",
    },
    neftRemark: { type: String, default: "-" },
    parties: { type: [PartyNeftSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NeftRequest", NeftRequestSchema);
