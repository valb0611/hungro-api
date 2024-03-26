const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  expirationDate: Date,
  quantityNeeded: Number,
  quantityDonated: Number,
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});

module.exports = mongoose.model("Product", ProductSchema);
