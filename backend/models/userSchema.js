import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [30, "Name cannot exceed 30 characters."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: function () {
      return this.role === "Job Seeker" || this.role === "Employer";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === "Job Seeker" || this.role === "Employer";
    },
  },

   niches: {
    type: {
      firstNiche: String,
      secondNiche: String,
      thirdNiche: String,
    },
    required: function() {
      return this.role === "Job Seeker"; // Only required for Job Seeker
    },
    _id: false, // Prevents Mongoose from adding an _id to the nested object
  },

  password: {
    type: String,
    required: true,
    minLength: [8, "Password must contain at least 8 characters"],
    select: false,
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer", "Admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT token method
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
