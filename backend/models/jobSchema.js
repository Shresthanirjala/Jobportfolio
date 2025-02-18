import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time"],
  },
  companyName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
  },
  responsibilities:{
    type: String,
    required: true
  },
  qualifications: {
    type: String,
    required: true,
  },
  offers: {
    type: String,
  },
  salary: {
    type: String,
    required: true,
  },
  hiringMultipleCandidates: {
    type: String,
    default: "no",
    enum: ["Yes", "No"],
  },
  personalWebsites: {
    title: String,
    url: String,
    
  },
  jobNiche: {
    type: String,
    required: true,
  },
  newsLettersSent: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
