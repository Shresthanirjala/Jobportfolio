import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

// Get all employers
export const getAllEmployers = catchAsyncError(async (req, res) => {
  const employers = await User.find({ role: "Employer" });
  res.status(200).json({ success: true, employers });
});

// Get all seekers
export const getAllSeekers = catchAsyncError(async (req, res) => {
  const seekers = await User.find({ role: "Job Seeker" });
  res.status(200).json({ success: true, seekers });
});

// Get all jobs
export const getAllJobs = catchAsyncError(async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "name email");
  res.status(200).json({ success: true, jobs });
});

// Get all applications
export const getAllApplications = catchAsyncError(async (req, res) => {
  const applications = await Application.find()
    .populate("jobInfo.jobId", "title")
    .populate("jobSeekerInfo.id", "name email")
    .lean();

  res.status(200).json({ success: true, applications });
});

// Delete a user
export const deleteUser = catchAsyncError(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

// Delete a job
export const deleteJob = catchAsyncError(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(200).json({ success: true, message: "Job deleted successfully" });
});
