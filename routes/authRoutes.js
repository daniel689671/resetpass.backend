const express = require("express");
const routes = express.Router();
const {
  sendResetCode,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");

// Auth-related routes
routes.post("/send-reset-code", sendResetCode);
routes.post("/verify-reset-code", verifyResetCode);
routes.post("/reset-password", resetPassword);

module.exports = routes;
