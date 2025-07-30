import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js"; // adjust the import to your actual job model

// Utility to calculate Jaccard Similarity
function jaccardSimilarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all past jobs the user applied to
    const pastApplications = await Application.find({ "jobSeekerInfo.id": userId });

    if (pastApplications.length === 0) {
      return res.status(200).json({ recommendedJobs: [] });
    }

    // Collect past job titles and any relevant tags/fields
    const appliedJobIds = pastApplications.map(app => app.jobInfo.jobId);
    const appliedJobs = await Job.find({ _id: { $in: appliedJobIds } });

    // Flatten keywords from all jobs user applied to
    const appliedKeywords = new Set();
    appliedJobs.forEach(job => {
      const tags = (job?.jobKeywords || job?.jobtitle || "").toLowerCase().split(/\W+/);
      tags.forEach(tag => appliedKeywords.add(tag));
    });

    // Get all available jobs
    const allJobs = await Job.find();

    const scoredJobs = allJobs.map(job => {
      const jobTags = (job?.jobKeywords || job?.jobNiche || "").toLowerCase().split(/\W+/);
      const score = jaccardSimilarity([...appliedKeywords], jobNiche);
      return { job, score };
    });

    // Sort and filter top results
    const recommendedJobs = scoredJobs
      .sort((a, b) => b.score - a.score)
      .filter(job => job.score > 0)
      .map(item => item.job)
      .slice(0, 10);

    res.status(200).json({ recommendedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
