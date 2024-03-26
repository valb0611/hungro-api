const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  description: String,
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
