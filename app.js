const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api/auth", authRoutes); // For authentication: reset code, verify, etc.

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();

// nguyennguyen7510159

// fQLMeeCR9q9J88UX

// mongodb+srv://nguyennguyen7510159:fQLMeeCR9q9J88UX@cluster0.vx8ulpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
