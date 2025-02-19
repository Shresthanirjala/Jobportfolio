import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js"; // Assuming Job model is present

export const postJob = catchAsyncError(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsitesTitle,
    personalWebsitesUrl,
    jobNiche,
    newsLettersSent,
  } = req.body;

  // Check if any required fields are missing
  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche ||
    !newsLettersSent
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // Additional validation for personal websites
  if (
    (personalWebsitesTitle && !personalWebsitesUrl) ||
    (!personalWebsitesTitle && personalWebsitesUrl)
  ) {
    return next(
      new ErrorHandler(
        "Both personalWebsitesTitle and personalWebsitesUrl are required together",
        400
      )
    );
  }

  // Example: Ensure salary is a valid number
  if (isNaN(salary) || salary <= 0) {
    return next(new ErrorHandler("Please provide a valid salary", 400));
  }

  // Proceed with job posting if all validations pass
  const newJob = new Job({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsitesTitle,
    personalWebsitesUrl,
    jobNiche,
    newsLettersSent,
  });

  await newJob.save();

  res.status(201).json({
    success: true,
    message: "Job posted successfully!",
    job: newJob,
  });


const postedBy = req.user._id;
const job = await Job.create({
  title,
  jobType,
  location,
  companyName,
  introduction,
  responsibilities,
  qualifications,
  offers,
  salary,
  hiringMultipleCandidates,
  personalWebsites: {
    title: personalWebsitesTitle,
    url: personalWebsitesUrl,
  },

  jobNiche,
  postedBy,
});
res.status(201).json({
  success: true,
  message: "Job Posted Successfully.",
  job,
})
});
