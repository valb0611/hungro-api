const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
});

module.exports = mongoose.model("Donor", DonorSchema);
