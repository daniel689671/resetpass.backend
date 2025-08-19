const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // optional
    phone: { type: String, required: true, unique: true }, // unique for password reset
    password: { type: String, required: true }, // will be hashed
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
