const twilio = require("twilio");
const ResetCode = require("../models/ResetCode");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//  Utility function to validate phone number
function isValidPhone(phone) {
  // Very basic: must start with + and have at least 10 digits after
  return /^\+\d{10,15}$/.test(phone);
}

exports.sendResetCode = async (req, res) => {
  const { phone } = req.body;

  if (!phone || !phone.startsWith("+")) {
    return res
      .status(400)
      .json({ error: "Please provide a valid phone number with country code" });
  }

  const code = Math.floor(10000 + Math.random() * 90000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  try {
    await ResetCode.findOneAndUpdate(
      { phone },
      { code, expiry, verified: false },
      { upsert: true, new: true }
    );

    await client.messages.create({
      body: `Your reset code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return res
      .status(200)
      .json({ message: "Reset code sent successfully via SMS!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send SMS" });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code || !isValidPhone(phone)) {
    return res
      .status(400)
      .json({ error: "Valid phone number and code are required" });
  }

  try {
    const record = await ResetCode.findOne({ phone });

    if (!record) {
      return res
        .status(404)
        .json({ error: "No reset code found for this phone number" });
    }

    if (Date.now() > record.expiry.getTime()) {
      await ResetCode.deleteOne({ phone });
      return res.status(400).json({ error: "Reset code has expired" });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    record.verified = true;
    await record.save();

    return res
      .status(200)
      .json({ message: "Reset code verified successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, newPassword, confirmPassword } = req.body;

    if (!phone || !newPassword || !confirmPassword || !isValidPhone(phone)) {
      return res.status(400).json({
        message: "All fields are required and phone must include country code",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
