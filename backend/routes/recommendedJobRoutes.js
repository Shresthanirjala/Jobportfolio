import express from "express";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

const router = express.Router();

// GET /api/recommended-jobs
router.get(
  "/",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const user = req.user;

    if (!user || !user.niches) {
      return next(new ErrorHandler("User interests not found", 400));
    }

    const { firstNiche, secondNiche, thirdNiche } = user.niches;
    const userInterests = [firstNiche, secondNiche, thirdNiche];

    const recommendedJobs = await Job.find({
      jobNiche: { $in: userInterests },
    });

    if (recommendedJobs.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        jobs: [],
        message: "No jobs found according to your interests.",
      });
    }

    res.status(200).json({
      success: true,
      total: recommendedJobs.length,
      jobs: recommendedJobs,
    });
  })
);

export default router;
