// 📦 Import Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔗 Import Mongoose Schema/Model

const GreyOrderSchema = new Schema(
  {
    orderNo: { type: String, required: true, unique: true }, // Order Number
    orderDate: { type: Date, default: Date.now }, // Order Date comes automatically but can we change
    agentName: { type: String, required: true }, // Agent Name
    itemName: { type: String, required: true }, // Quality
    rate: { type: Number, required: true }, // Rate
    than: { type: Number, required: true }, // Thaan
    partyName: { type: String }, // Party Name
    remarks: { type: String, default: "" }, // Remarks
  },
  { timestamps: true }
);

module.exports = mongoose.model("GreyOrder", GreyOrderSchema);
