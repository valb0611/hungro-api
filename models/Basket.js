const mongoose = require("mongoose");

const BasketSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  recipient: String,
  deliveryDate: Date,
});

module.exports = mongoose.model("Basket", BasketSchema);
