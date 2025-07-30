import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";



// Controller to post a new job
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
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
    jobKeywords,
  } = req.body;

  console.log("Received job data:", req.body);

  // Basic validation
  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  ) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (!personalWebsiteTitle && personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler(
        "Provide both the website URL and title, or leave both blank.",
        400
      )
    );
  }

  const postedBy = req.user._id;

  // Convert jobKeywords from string to array if needed
  const keywordsArray = Array.isArray(jobKeywords)
    ? jobKeywords
    : jobKeywords
    ? jobKeywords
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0)
    : [];

  // Create new job document using schema field names
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
      title: personalWebsiteTitle || "",
      url: personalWebsiteUrl || "",
    },
    jobNiche,
    jobKeywords: keywordsArray,
    postedBy,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

// Controller to get all jobs with filtering
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const { city, niche, jobKeywords, searchKeyword } = req.query;
  const query = {};

  if (city) {
    query.location = city;
  }

  if (niche) {
    query.jobNiche = niche;
  }

  // Search keyword-based matching on multiple fields
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
      { jobKeywords: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query);

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

// Controller to get jobs posted by the logged-in user
export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const myJobs = await Job.find({ postedBy: req.user._id });

  res.status(200).json({
    success: true,
    myJobs,
  });
});

// Controller to delete a job by ID
export const deleteJobs = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Oops!! Job not found.", 404));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});

// Controller to get a single job by ID
export const getASingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  res.status(200).json({
    success: true,
    job,
  });
});


const getJobWithPoster = async (jobId) => {
  const job = await Job.findById(jobId).populate("postedBy", "name email"); 
  // populate 'postedBy' field with User's name and email (you can customize fields)
  
  return job;
};
