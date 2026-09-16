import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({ role: "Job Seeker" }).select(
      "email resume"
    );
    users.forEach((u) => {
      console.log(u.email, "->", u.resume?.url || "(no resume)");
    });
    process.exit(0);
  })
  .catch((e) => {
    console.error("ERROR:", e.message);
    process.exit(1);
  });
