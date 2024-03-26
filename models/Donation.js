const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  donationDate: Date,
  deliveryMethod: { type: String, required: true },
  address: { type: String },
  organizationCampus: { type: String },
  quantity: { type: String },
});

module.exports = mongoose.model("Donation", DonationSchema);
