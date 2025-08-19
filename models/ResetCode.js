const mongoose = require("mongoose");

const resetCodeSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

resetCodeSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("ResetCode", resetCodeSchema);
