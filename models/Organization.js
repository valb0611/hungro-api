const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  donationsReceived: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
  ],
  baskets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Basket" }],
  campus: [String],
});

module.exports = mongoose.model("Organization", OrganizationSchema);
