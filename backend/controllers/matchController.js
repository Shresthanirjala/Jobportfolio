import { Job } from "../models/jobSchema.js";
import { Resume } from "../models/resumeSchema.js";
import { analyzeResume } from "../services/mlService.js";

export const handleResumeAnalysis = async (req, res) => {
  const cvUrl = req.body.cvUrl || req.body.cv_url;

  if (!cvUrl) {
    return res.status(400).json({
      success: false,
      message: "A Cloudinary CV URL is required.",
    });
  }

  try {
    const jobs = await Job.find()
      .select("_id title companyName introduction responsibilities qualifications offers")
      .lean();

    const jobsPayload = jobs.map((job) => ({
      id: job._id.toString(),
      description: [
        job.introduction,
        job.responsibilities,
        job.qualifications,
        job.offers,
      ]
        .filter(Boolean)
        .join("\n"),
    }));

    const analysis = await analyzeResume(cvUrl, jobsPayload);
    const matches = analysis.matches || [];

    await Resume.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        cvUrl,
        extractedSkills: analysis.skills || [],
        jobMatches: matches,
      },
      { new: true, upsert: true, runValidators: true }
    );

    const jobsById = new Map(jobs.map((job) => [job._id.toString(), job]));
    const topMatch = matches[0];
    const recommendedJob = topMatch
      ? {
          ...topMatch,
          title: jobsById.get(topMatch.jobId)?.title,
          companyName: jobsById.get(topMatch.jobId)?.companyName,
        }
      : null;

    return res.status(200).json({ ...analysis, recommendedJob });
  } catch (error) {
    console.error("Resume analysis failed:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Resume analysis failed. Please try again later.",
    });
  }
};