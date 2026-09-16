import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    jobMatches: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);