import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js"; // Ensure the correct path to your user schema

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jobportal";

// ✅ Connect to DB
mongoose
  .connect(uri)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    console.log("📛 Connected to database:", mongoose.connection.name);

    const adminEmail = "admin123@gmail.com";
    const adminPassword = "admin1234";  // The raw password that will be hashed automatically

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      // Directly create the admin without manually hashing the password
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,  // Use the raw password, it will be hashed automatically by the schema
        role: "Admin",
      });
      console.log("✅ Admin user created");
    } else {
      console.log("⚠️ Admin already exists");
    }

    process.exit();  // Exit the script after creating the admin
  })
  .catch((err) => {
    console.error("⚠️ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
