// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
require("dotenv").config();

const testUsers = [
  {
    firstName: "Test",
    lastName: "Nigeria",
    email: "nigeria@example.com",
    phone: "+2349067596368",
    password: "mySecret123",
  },
  {
    firstName: "Test",
    lastName: "USA",
    email: "usa@example.com",
    phone: "+12025550123",
    password: "mySecret123",
  },
  {
    firstName: "Test",
    lastName: "UK",
    email: "uk@example.com",
    phone: "+447911123456",
    password: "mySecret123",
  },
  {
    firstName: "Test",
    lastName: "India",
    email: "india@example.com",
    phone: "+919876543210",
    password: "mySecret123",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const existing = await User.findOne({ phone: userData.phone });
      if (existing) {
        console.log(
          `User with phone ${userData.phone} already exists. Skipping.`
        );
      } else {
        const user = new User({ ...userData, password: hashedPassword });
        await user.save();
        console.log(`Test user ${userData.phone} created!`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
