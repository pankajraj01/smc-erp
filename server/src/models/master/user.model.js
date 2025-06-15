// 📦 Import Dependencies
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3 },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
