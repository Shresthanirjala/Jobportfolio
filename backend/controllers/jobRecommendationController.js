import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";

// Utility to calculate Jaccard Similarity
function jaccardSimilarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Normalizer map to group similar concepts
const synonymMap = {
  designing: "design",
  designer: "design",
  design: "design",
  creative: "create",
  creativity: "create",
  creating: "create",
  developing: "develop",
  development: "develop",
  developer: "develop",
  // Add more if needed
};

function normalizeWords(words) {
  return words.map((word) => synonymMap[word] || word);
}

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const pastApplications = await Application.find({
      "jobSeekerInfo.id": userId,
    });

    if (pastApplications.length === 0) {
      return res.status(200).json({ recommendedJobs: [] });
    }

    const appliedJobIds = pastApplications.map((app) => app.jobInfo.jobId);
    const appliedJobs = await Job.find({ _id: { $in: appliedJobIds } });

    const appliedKeywords = new Set();
    appliedJobs.forEach((job) => {
      const rawTags = String(job?.jobKeywords || job?.jobtitle || "")
        .toLowerCase()
        .split(/\W+/);
      const normalizedTags = normalizeWords(rawTags);
      normalizedTags.forEach((tag) => appliedKeywords.add(tag));
    });

    const allJobs = await Job.find();

    const scoredJobs = allJobs.map((job) => {
      const rawTags = String(job?.jobKeywords || job?.jobNiche || "")
        .toLowerCase()
        .split(/\W+/);
      const normalizedTags = normalizeWords(rawTags);
      const score = jaccardSimilarity([...appliedKeywords], normalizedTags);
      return { job, score };
    });

    const recommendedJobs = scoredJobs
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .map((item) => item.job)
      .slice(0, 10);

    res.status(200).json({ recommendedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
