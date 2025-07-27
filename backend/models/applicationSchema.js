import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "please proide a valid email."],
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
    },
  },
  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false,
    },
    employer: {
      type: Boolean,
      default: false,
    },
  },
  appliedDate: {
  type: Date,
  default: Date.now,
}
});
export const Application = mongoose.model("Application", applicationSchema);
